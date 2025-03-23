from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from rest_framework.decorators import api_view

from ..utils.indoor_direction_api_utils import get_indoor_directions_data


@api_view(["GET"])
@require_http_methods(["GET"])
def get_indoor_directions(request):
    start = request.GET.get("start")
    destination = request.GET.get("destination")
    disabled = request.GET.get("disabled")
    data = get_indoor_directions_data(start, destination, disabled)
    if data is not None:
        return JsonResponse(data)
    else:
        return JsonResponse({})
