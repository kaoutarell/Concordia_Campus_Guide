from django.http import JsonResponse
from rest_framework.decorators import api_view
from ..utils.direction_api_utils import ors_directions, otp_directions
from django.views.decorators.csrf import csrf_exempt

@api_view(['GET'])
@csrf_exempt
def foot_walking_directions(request):
    return get_directions(request, 'foot-walking')

@api_view(['GET'])
@csrf_exempt
def cycling_regular_directions(request):
    return get_directions(request, 'cycling-regular')

@api_view(['GET'])
@csrf_exempt
def driving_car_directions(request):
    return get_directions(request, 'driving-car')

@api_view(['GET'])
@csrf_exempt
def wheelchair_directions(request):
    return get_directions(request, 'wheelchair')

@api_view(['GET'])
@csrf_exempt
def public_transport_directions(request):
    return get_directions(request, 'public-transport')

@api_view(['GET'])
@csrf_exempt
def shuttle_bus_directions(request):
    return get_directions(request, 'concordia-shuttle')

@api_view(['GET'])
@csrf_exempt
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
