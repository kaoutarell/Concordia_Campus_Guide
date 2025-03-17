from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.geos import Point
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from rest_framework.decorators import api_view

from ..models.building import Building
from ..models.shuttle import ShuttleStop
from ..utils.direction_api_utils import (
    compute_bbox_from_steps,
    ors_directions,
    otp_directions,
)

from ..exceptions.exceptions import InvalidCoordinatesError, BuildingNotFoundError,ShuttleStopNotFoundError



@api_view(["GET"])
@require_http_methods(["GET"])
def foot_walking_directions(request):
    return get_directions(request, "foot-walking")


@api_view(["GET"])
@require_http_methods(["GET"])
def cycling_regular_directions(request):
    return get_directions(request, "cycling-regular")


@api_view(["GET"])
@require_http_methods(["GET"])
def driving_car_directions(request):
    return get_directions(request, "driving-car")


@api_view(["GET"])
@require_http_methods(["GET"])
def wheelchair_directions(request):
    return get_directions(request, "wheelchair")


@api_view(["GET"])
@require_http_methods(["GET"])
def public_transport_directions(request):
    return get_directions(request, "public-transport")


@api_view(["GET"])
@require_http_methods(["GET"])
def shuttle_bus_directions(request):
    return multi_modal_shuttle_directions(request)


@api_view(["GET"])
@require_http_methods(["GET"])
def get_profiles(_):
    return JsonResponse(
        {
            "profiles": [
                "foot-walking",
                "cycling-regular",
                "driving-car",
                "wheelchair",
                "public-transport",
                "concordia-shuttle",
            ]
        }
    )


def get_directions(request, profile):
    start = request.GET.get("start")
    end = request.GET.get("end")

    if not start or not end:
        return JsonResponse({"error": "Missing start or end parameter"}, status=400)
    if profile in [
        "foot-walking",
        "cycling-regular",
        "driving-car",
        "wheelchair",
        "concordia-shuttle",
    ]:
        route_info, code = ors_directions(start, end, profile)
    else:
        route_info, code = otp_directions(start, end)
    return JsonResponse(route_info, status=code)



def parse_coordinates(start, end):
    """Extracts and validates start and end coordinates."""

    if not start or not end:
        raise InvalidCoordinatesError("Missing start or end parameter")
    try:
        start_lon, start_lat = map(float, start.split(","))
        end_lon, end_lat = map(float, end.split(","))
    except ValueError:
        raise InvalidCoordinatesError("Invalid coordinate format. Use 'lon,lat'.")

    return (start_lon, start_lat), (end_lon, end_lat)

#
def find_nearest_building(point):
    building = (
        Building.objects.annotate(distance=Distance("location", point))
        .order_by("distance")
        .first()
    )

    if not building:
        raise BuildingNotFoundError("No nearby building found for the given location.")

    return building



def get_shuttle_stops(origin_campus, destination_campus):
    """Retrieves the shuttle stops for the given campuses."""
    try:
        return (
            ShuttleStop.objects.get(name=origin_campus),
            ShuttleStop.objects.get(name=destination_campus),
        )
    except ShuttleStop.DoesNotExist:
        raise ShuttleStopNotFoundError("Shuttle stop not found for one or both campuses.")


def build_combined_route(route_legs, origin_building, destination_building, origin_campus, destination_campus):
    """Constructs the final combined route from individual route legs."""

    total_distance = sum(leg.get("total_distance", 0) for leg in route_legs.values())
    total_duration = sum(leg.get("total_duration", 0) for leg in route_legs.values())

    # Merge steps from all legs
    combined_steps = [step for leg in route_legs.values() if "steps" in leg for step in leg["steps"]]

    return {
        "total_distance": total_distance,
        "total_duration": total_duration,
        "bbox": compute_bbox_from_steps(combined_steps),
        "legs": route_legs,
        "origin_building": origin_building.building_code,
        "destination_building": destination_building.building_code,
        "origin_campus": origin_campus,
        "destination_campus": destination_campus,
    }


def multi_modal_shuttle_directions(request):
    """
    Builds a multi-modal route by:
      1. Determining the nearest building (and campus) for the origin and destination.
      2. Looking up the shuttle stops for those campuses.
      3. Constructing a three-leg route:
         - Leg 1: Walk (foot-walking) from the origin to the origin campus shuttle stop.
         - Leg 2: Shuttle ride (simulated with 'driving-car') from the origin stop to the destination stop.
         - Leg 3: Walk (foot-walking) from the destination shuttle stop to the final destination.

    Expects the following GET parameters:
      - start: A string in the format "longitude,latitude" for the origin.
      - end:   A string in the format "longitude,latitude" for the destination.
    """
    start = request.GET.get("start")
    end = request.GET.get("end")

    try:
        coordinates = parse_coordinates(start, end)
    except InvalidCoordinatesError as e:
        return JsonResponse({"error": str(e)}, status=400)
    (start_lon, start_lat), (end_lon, end_lat) = coordinates

    origin_point = Point(start_lon, start_lat, srid=4326)
    destination_point = Point(end_lon, end_lat, srid=4326)

    # Find the nearest building to the origin and destination
    try:
        origin_building = find_nearest_building(origin_point)
        destination_building = find_nearest_building(destination_point)
    except BuildingNotFoundError as e:
        return JsonResponse({"error": str(e)}, status=404)

    origin_campus, destination_campus = origin_building.campus, destination_building.campus

    # If both locations are on the same campus, return direct walking directions
    if origin_campus == destination_campus:
        return get_directions(request, "foot-walking")


    # Look up the corresponding shuttle stops based on campus
    try:
        origin_stop, destination_stop = get_shuttle_stops(origin_campus, destination_campus)
    except ShuttleStopNotFoundError as e:
        return JsonResponse({"error": str(e)}, status=404)

    origin_stop_coord = f"{origin_stop.longitude},{origin_stop.latitude}"
    destination_stop_coord = f"{destination_stop.longitude},{destination_stop.latitude}"

    # Leg 1: Walk from origin to the origin campus shuttle stop (foot-walking)
    leg1_response, code1 = ors_directions(start, origin_stop_coord, "foot-walking")
    if code1 != 200:
        return JsonResponse(
            {"error": "Error fetching walking directions for leg 1."}, status=code1
        )

    # Leg 2: Shuttle ride from origin stop to destination stop (simulate with 'driving-car')
    leg2_response, code2 = ors_directions(
        origin_stop_coord, destination_stop_coord, "driving-car"
    )
    if code2 != 200:
        return JsonResponse(
            {"error": "Error fetching shuttle ride directions for leg 2."}, status=code2
        )

    # Leg 3: Walk from destination shuttle stop to final destination (foot-walking)
    leg3_response, code3 = ors_directions(destination_stop_coord, end, "foot-walking")
    if code3 != 200:
        return JsonResponse(
            {"error": "Error fetching walking directions for leg 3."}, status=code3
        )
    route_legs = {
        "walk_to_stop": leg1_response,
        "shuttle_ride": leg2_response,
        "walk_from_stop": leg3_response,
    }
    combined_route = build_combined_route(route_legs, origin_building, destination_building, origin_campus,
                                          destination_campus)

    return JsonResponse(combined_route, status=200)





