import requests
from django.http import JsonResponse
from rest_framework.decorators import api_view

ORS_BASE_URL = "http://34.95.61.49/ors/v2/directions"

@api_view(['GET'])
def foot_walking_directions(request):
    start = request.GET.get('start')
    end = request.GET.get('end')

    if not start or not end:
        return JsonResponse({"error": "Missing start or end parameter"}, status=400)

    url = f"{ORS_BASE_URL}/foot-walking?start={start}&end={end}"
    response = requests.get(url)

    if response.status_code != 200:
        ors_error = response.json().get("error", "Unknown error")
        return JsonResponse({"error": "Failed to get directions", "ors_error": ors_error}, status=400)

    geojson_data = response.json()

    route_info = extract_route_info(geojson_data)

    return JsonResponse(route_info)

@api_view(['GET'])
def cycling_regular_directions(request):
    # TODO: Implement cycling_regular_directions
    return foot_walking_directions(request)

@api_view(['GET'])
def driving_car_directions(request):
    # TODO: Implement driving_car_directions
    return foot_walking_directions(request)

@api_view(['GET'])
def wheelchair_directions(request):
    # TODO: Implement wheelchair_directions
    return foot_walking_directions(request)

@api_view(['GET'])
def public_transport_directions(request):
    # TODO: Implement public_transport_directions
    return foot_walking_directions(request)

@api_view(['GET'])
def shuttle_bus_directions(request):
    # TODO: Implement shuttle_bus_directions
    return foot_walking_directions(request)

def extract_route_info(geojson_data):
    try:
        features = geojson_data.get("features", [])
        if not features:
            raise ValueError("No features found in GeoJSON data")
        route = {
                 "profile": geojson_data.get("metadata", {}).get("query", {}).get("profile"),
                 "startingCoordinates": features[0]["geometry"]["coordinates"][0],
                 "destinationCoordinates": features[0]["geometry"]["coordinates"][-1],
                 "total_distance": features[0]["properties"]["segments"][0]["distance"],
                 "total_duration": features[0]["properties"]["segments"][0]["duration"]
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
            "coordinates": coordinates[step["way_points"][0] : step["way_points"][1] + 1],
            })

        route["steps"] = route_info
        return route
    except Exception as e:
        return {"error": str(e)}