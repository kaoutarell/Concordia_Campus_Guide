from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from rest_framework.decorators import api_view

from ..utils.indoor_direction_api_utils import get_indoor_directions_data


@api_view(["GET"])
@require_http_methods(["GET"])
def get_indoor_directions(request):
    data = get_indoor_directions_data(request)
    if data is not None:
        return JsonResponse(data)
    else:
        return JsonResponse({})
