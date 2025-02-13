from django.http import JsonResponse
from rest_framework.decorators import api_view
import requests
import polyline
from geopy.distance import geodesic
import numpy as np
from ..constants import ORS_BASE_URL, OTP_BASE_URL, OTP_HEADER, OTP_AVG_WALKING_SPEED, OTP_QUERY

@api_view(['GET'])
def foot_walking_directions(request):
    return get_directions(request, 'foot-walking')

@api_view(['GET'])
def cycling_regular_directions(request):
    return get_directions(request, 'cycling-regular')

@api_view(['GET'])
def driving_car_directions(request):
    return get_directions(request, 'driving-car')

@api_view(['GET'])
def wheelchair_directions(request):
    return get_directions(request, 'wheelchair')

@api_view(['GET'])
def public_transport_directions(request):
    return get_directions(request, 'public-transport')

@api_view(['GET'])
def shuttle_bus_directions(request):
    return get_directions(request, 'concordia-shuttle')

@api_view(['GET'])
def get_profiles(request):
    return JsonResponse({
        "profiles": [
            "foot-walking",
            "cycling-regular",
            "driving-car",
            "wheelchair",
            "public-transport",
            "concordia-shuttle"
        ]
    })

def get_directions(request, profile):
    start = request.GET.get('start')
    end = request.GET.get('end')

    if not start or not end:
        return JsonResponse({"error": "Missing start or end parameter"}, status=400)
    
    if profile in ['foot-walking', 'cycling-regular', 'driving-car', 'wheelchair', 'concordia-shuttle']:
        route_info = ors_directions(start, end, profile)
    else:
        route_info = otp_directions(start, end)
    
    return JsonResponse(route_info)

def ors_directions(start, end, profile):
    url = f"{ORS_BASE_URL}/{profile}?start={start}&end={end}"
    response = requests.get(url)

    if response.status_code != 200:
        ors_error = response.json().get("error", "Unknown error")
        return JsonResponse({"error": "Failed to get directions", "ors_error": ors_error}, status=400)

    return parse_ors_directions(response.json())

def parse_ors_directions(geojson_data):
    try:
        features = geojson_data.get("features", [])
        if not features:
            raise ValueError("No features found in GeoJSON data")
        route = {
            "profile": geojson_data.get("metadata", {}).get("query", {}).get("profile"),
            "startingCoordinates": features[0]["geometry"]["coordinates"][0],
            "destinationCoordinates": features[0]["geometry"]["coordinates"][-1],
            "total_distance": features[0]["properties"]["segments"][0]["distance"],
            "total_duration": features[0]["properties"]["segments"][0]["duration"],
            "bbox": geojson_data.get("bbox", []),
        }

        steps = features[0]["properties"]["segments"][0]["steps"]
        coordinates = features[0]["geometry"]["coordinates"]
        route_info = []

        for step in steps:
            route_info.append({
                "distance": step["distance"],
                "duration": step["duration"],
                "instruction": step["instruction"],
                "type": step["type"],
                "coordinates": coordinates[step["way_points"][0]: step["way_points"][1] + 1],
            })

        route["steps"] = route_info
        return route
    except Exception as e:
        return {"error": str(e)}

def otp_directions(start, end):
    start = start.split(",")
    end = end.split(",")

    response = requests.post(OTP_BASE_URL, headers=OTP_HEADER, json=OTP_QUERY(start, end, True, 3))

    if response.status_code != 200:
        otp_error = response.json().get("errors", "Unknown error")
        return JsonResponse({"error": "Failed to get directions", "otp_error": otp_error}, status=400)

    return parse_otp_directions(response.json(), start, end)

def parse_otp_directions(json, start, end):
    tripPatterns = json["data"]["trip"]["tripPatterns"]
    # To avoid trip patterns with only foot walking, select the first one with more than one leg
    tripPattern = next((pattern for pattern in tripPatterns if len(pattern["legs"]) > 1), tripPatterns[0])

    allSteps = []
    for leg in tripPattern["legs"]:
        allSteps.extend(parse_leg(leg))
    # Add last destination step
    allSteps.append({
        "distance": 0,
        "duration": 0,
        "instruction": "Arrived at destination",
        "type": -1,
        "coordinates": [[float(coord) for coord in end]]
    })

    route = {
        "profile": "public-transport",
        "startingCoordinates": [float(coord) for coord in start],
        "destinationCoordinates": [float(coord) for coord in end],
        "total_distance": tripPattern["distance"],
        "total_duration": tripPattern["duration"],
        "bbox": bounding_box(get_all_coordinates(allSteps)),
        "steps": allSteps
    }

    return route

def find_closest_point(step, path):
    """Finds the index of the closest path point to a given step."""
    step_coord = (step["latitude"], step["longitude"])
    distances = [geodesic(step_coord, (p[0], p[1])).meters for p in path]
    n = np.argmin(distances)
    return n  # Return index of the closest path point

def match_steps_to_path(steps, path, mode):
    """Matches navigation steps to the closest points in the path and links coordinates."""
    matched_indices = []
    if mode != "foot": matched_indices.append(0)
    for step in steps:
        closest_idx = find_closest_point(step, path)
        matched_indices.append(closest_idx)
    if mode != "foot": matched_indices.append(len(path)-1)
    return matched_indices

def parse_leg(leg):
    if leg["mode"] == "foot":
        steps = leg["steps"]
    else:
        steps = leg["intermediateQuays"]
    path = polyline.decode(leg["pointsOnLink"]["points"])
    matched_indices = match_steps_to_path(steps, path, leg["mode"])
    result = []
    for i in range(len(steps)):
        start_idx = matched_indices[i]
        # if last step, end_idx is the last point in the path
        if i == len(steps)-1:
            end_idx = len(path)-1
        else:
            end_idx = matched_indices[i+1]
        
        if leg["mode"] == "foot":
            instruction = f"Head {steps[i]['heading']} on {steps[i]['streetName']}"
            type = -1
        else:
            # Add get on/off instructions for metro/bus
            if i == 0:
                instruction = f"Get on {leg['mode'].capitalize()} {leg['line']['publicCode']} {leg['line']['name']}: {steps[i]['name']}"
            elif i == len(steps)-1:
                instruction = f"Get off {leg['mode'].capitalize()} {leg['line']['publicCode']} {leg['line']['name']} at {steps[i]['name']}"
            else:     
                instruction = f"Stay in {leg['mode'].capitalize()} {leg['line']['publicCode']} {leg['line']['name']}: {steps[i]['name']}"
            type = -1
        step_data = {
            "distance": steps[i].get("distance", 0),
            "duration": steps[i].get("distance", 0) / OTP_AVG_WALKING_SPEED,
            "instruction": instruction,  
            "type": type,
            "coordinates": [[lon, lat] for lat, lon in path[start_idx:end_idx+1]]
        }
        result.append(step_data)
    return result

def bounding_box(points):
    x_coordinates, y_coordinates = zip(*points)
    return [min(x_coordinates), min(y_coordinates), max(x_coordinates), max(y_coordinates)]

def get_all_coordinates(steps):
    all_coordinates = []
    for step in steps:
        all_coordinates.extend(step["coordinates"])
    return all_coordinates