from django.http import JsonResponse
from rest_framework.decorators import api_view
from django.views.decorators.http import require_http_methods
from django.contrib.gis.geos import Point
from django.contrib.gis.db.models.functions import Distance
from ..utils.direction_api_utils import ors_directions, otp_directions, compute_bbox_from_steps
from ..models.shuttle import ShuttleStop
from ..models.building import Building

@api_view(['GET'])
@require_http_methods(['GET'])
def foot_walking_directions(request):
    return get_directions(request, 'foot-walking')

@api_view(['GET'])
@require_http_methods(['GET'])
def cycling_regular_directions(request):
    return get_directions(request, 'cycling-regular')

@api_view(['GET'])
@require_http_methods(['GET'])
def driving_car_directions(request):
    return get_directions(request, 'driving-car')

@api_view(['GET'])
@require_http_methods(['GET'])
def wheelchair_directions(request):
    return get_directions(request, 'wheelchair')

@api_view(['GET'])
@require_http_methods(['GET'])
def public_transport_directions(request):
    return get_directions(request, 'public-transport')

@api_view(['GET'])
@require_http_methods(['GET'])
def shuttle_bus_directions(request):
    return multi_modal_shuttle_directions(request)

@api_view(['GET'])
@require_http_methods(['GET'])
def get_profiles(_):
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
        route_info, code = ors_directions(start, end, profile)
    else:
        route_info, code = otp_directions(start, end)
    return JsonResponse(route_info, status=code)

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
    start = request.GET.get('start')
    end = request.GET.get('end')

    if not start or not end:
        return JsonResponse({"error": "Missing start or end parameter"}, status=400)

    try:
        start_lon, start_lat = map(float, start.split(','))
        end_lon, end_lat = map(float, end.split(','))
    except Exception:
        return JsonResponse({"error": "Invalid coordinate format. Use 'lon,lat'."}, status=400)

    origin_point = Point(start_lon, start_lat, srid=4326)
    destination_point = Point(end_lon, end_lat, srid=4326)

    # Find the nearest building to the origin and destination
    origin_building = (
        Building.objects
        .annotate(distance=Distance('location', origin_point))
        .order_by('distance')
        .first()
    )
    destination_building = (
        Building.objects
        .annotate(distance=Distance('location', destination_point))
        .order_by('distance')
        .first()
    )

    if not origin_building or not destination_building:
        return JsonResponse(
            {"error": "No nearby building found for origin or destination."},
            status=404
        )

    origin_campus = origin_building.campus
    destination_campus = destination_building.campus

    if origin_campus == destination_campus:
        return get_directions(request, 'foot-walking')

    # Look up the corresponding shuttle stops based on campus
    try:
        origin_stop = ShuttleStop.objects.get(name=origin_campus)
        destination_stop = ShuttleStop.objects.get(name=destination_campus)
    except ShuttleStop.DoesNotExist:
        return JsonResponse(
            {"error": "Shuttle stop not found for one or both campuses."},
            status=404
        )

    origin_stop_coord = f"{origin_stop.longitude},{origin_stop.latitude}"
    destination_stop_coord = f"{destination_stop.longitude},{destination_stop.latitude}"

    # Leg 1: Walk from origin to the origin campus shuttle stop (foot-walking)
    leg1_response, code1 = ors_directions(start, origin_stop_coord, 'foot-walking')
    if code1 != 200:
        return JsonResponse({"error": "Error fetching walking directions for leg 1."}, status=code1)

    # Leg 2: Shuttle ride from origin stop to destination stop (simulate with 'driving-car')
    leg2_response, code2 = ors_directions(origin_stop_coord, destination_stop_coord, 'driving-car')
    if code2 != 200:
        return JsonResponse({"error": "Error fetching shuttle ride directions for leg 2."}, status=code2)

    # Leg 3: Walk from destination shuttle stop to final destination (foot-walking)
    leg3_response, code3 = ors_directions(destination_stop_coord, end, 'foot-walking')
    if code3 != 200:
        return JsonResponse({"error": "Error fetching walking directions for leg 3."}, status=code3)

    total_distance = (
        leg1_response.get("total_distance", 0) +
        leg2_response.get("total_distance", 0) +
        leg3_response.get("total_distance", 0)
    )
    total_duration = (
        leg1_response.get("total_duration", 0) +
        leg2_response.get("total_duration", 0) +
        leg3_response.get("total_duration", 0)
    )

    combined_steps = []
    for leg in (leg1_response, leg2_response, leg3_response):
        if "steps" in leg:
            combined_steps.extend(leg["steps"])

    combined_route = {
        "total_distance": total_distance,
        "total_duration": total_duration,
        "bbox": compute_bbox_from_steps(combined_steps),
        "legs": {
            "walk_to_stop": leg1_response,
            "shuttle_ride": leg2_response,
            "walk_from_stop": leg3_response,
        },
        "origin_building": origin_building.building_code,
        "destination_building": destination_building.building_code,
        "origin_campus": origin_campus,
        "destination_campus": destination_campus,
    }

    return JsonResponse(combined_route, status=200)