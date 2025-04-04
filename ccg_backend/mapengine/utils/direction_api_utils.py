import numpy as np
import polyline
import requests
from geopy.distance import geodesic

from ..constants import (
    ORS_BASE_URL,
    OTP_AVG_WALKING_SPEED,
    OTP_BASE_URL,
    OTP_HEADER,
    otp_query,
)


def ors_directions(start, end, profile):
    url = f"{ORS_BASE_URL}/{profile}?start={start}&end={end}"
    response = requests.get(url)
    if response.status_code != 200:
        ors_error = response.json().get("error", "Unknown error")
        return {"error": "Failed to get directions", "ors_error": ors_error}, 400
    return parse_ors_directions(response.json()), 200


def parse_ors_directions(geojson_data):
    features = geojson_data.get("features", [])
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
        route_info.append(
            {
                "distance": step["distance"],
                "duration": step["duration"],
                "instruction": step["instruction"],
                "type": step["type"],
                "coordinates": coordinates[
                    step["way_points"][0]: step["way_points"][1] + 1
                ],
            }
        )

    route["steps"] = route_info
    return route


def otp_directions(start, end):
    start = start.split(",")
    end = end.split(",")

    response = requests.post(
        OTP_BASE_URL, headers=OTP_HEADER, json=otp_query(start, end, True, 3)
    )

    return parse_otp_directions(response.json(), start, end)


def parse_otp_directions(json, start, end):
    trip_patterns = json["data"]["trip"]["tripPatterns"]
    # To avoid trip patterns with only foot walking, select the first one with more than one leg
    if len(trip_patterns) >= 1:
        trip_patterns = next(
            (pattern for pattern in trip_patterns if len(pattern["legs"]) > 1),
            trip_patterns[0],
        )
    else:
        return {"error": "No trip patterns found"}, 400

    all_steps = []
    for leg in trip_patterns["legs"]:
        all_steps.extend(parse_leg(leg))
    # Add last destination step
    all_steps.append(
        {
            "distance": 0,
            "duration": 0,
            "instruction": "Arrived at destination",
            "type": -1,
            "coordinates": [[float(coord) for coord in end]],
        }
    )

    route = {
        "profile": "public-transport",
        "startingCoordinates": [float(coord) for coord in start],
        "destinationCoordinates": [float(coord) for coord in end],
        "total_distance": trip_patterns["distance"],
        "total_duration": trip_patterns["duration"],
        "bbox": bounding_box(get_all_coordinates(all_steps)),
        "steps": all_steps,
    }

    return route, 200


def find_closest_point(step, path):
    """Finds the index of the closest path point to a given step."""
    step_coord = (step["latitude"], step["longitude"])
    distances = [geodesic(step_coord, (p[0], p[1])).meters for p in path]
    n = np.argmin(distances)
    return n  # Return index of the closest path point


def match_steps_to_path(steps, path, mode):
    """Matches navigation steps to the closest points in the path and links coordinates."""
    matched_indices = []
    if mode != "foot":
        matched_indices.append(0)
    for step in steps:
        closest_idx = find_closest_point(step, path)
        matched_indices.append(closest_idx)
    if mode != "foot":
        matched_indices.append(len(path) - 1)
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
        if i == len(steps) - 1:
            end_idx = len(path) - 1
        else:
            end_idx = matched_indices[i + 1]

        # If the step is only one point, skip it
        # if start_idx == end_idx:
        #     continue

        if leg["mode"] == "foot":
            instruction = f"Head {steps[i]['heading']} on {steps[i]['streetName']}"
        else:
            # Add get on/off instructions for metro/bus
            if i == 0:
                instruction = f"Get on {leg['mode'].capitalize()} {leg['line']['publicCode']} {leg['line']['name']}: {steps[i]['name']}"
            elif i == len(steps) - 1:
                instruction = f"Get off {leg['mode'].capitalize()} {leg['line']['publicCode']} {leg['line']['name']} at {steps[i]['name']}"
            else:
                instruction = f"Stay in {leg['mode'].capitalize()} {leg['line']['publicCode']} {leg['line']['name']}: {steps[i]['name']}"
        step_data = {
            "distance": steps[i].get("distance", 0),
            "duration": steps[i].get("distance", 0) / OTP_AVG_WALKING_SPEED,
            "instruction": instruction,
            "type": 0,
            "coordinates": [[lon, lat] for lat, lon in path[start_idx: end_idx + 1]],
        }
        result.append(step_data)
    return result


def bounding_box(points):
    x_coordinates, y_coordinates = zip(*points)
    return [
        min(x_coordinates),
        min(y_coordinates),
        max(x_coordinates),
        max(y_coordinates),
    ]


def get_all_coordinates(steps):
    all_coordinates = []
    for step in steps:
        all_coordinates.extend(step["coordinates"])
    return all_coordinates


def compute_bbox_from_steps(steps):
    """
    Given a list of steps (each step having a "coordinates" key with a list of [lon, lat] points),
    compute and return a single bbox [min_lon, min_lat, max_lon, max_lat].
    """
    all_coords = []
    for step in steps:
        coords = step.get("coordinates", [])
        if coords:
            all_coords.extend(coords)
    if all_coords:
        lons = [pt[0] for pt in all_coords]
        lats = [pt[1] for pt in all_coords]
        return [min(lons), min(lats), max(lons), max(lats)]
    return []
