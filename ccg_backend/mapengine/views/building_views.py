from django.views.decorators.http import require_http_methods
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from ..models.building import Building
from ..serializers.building_serializer import BuildingSerializer


@api_view(["GET"])
@require_http_methods(["GET"])
def get_buildings_by_campus(request):
    campus_name = request.GET.get("campus")

    if not campus_name:
        return Response({"error": "Missing campus parameter"}, status=400)

    buildings = Building.objects.filter(campus__iexact=campus_name)
    serializer = BuildingSerializer(buildings, many=True)

    return Response(serializer.data)


@api_view(["GET"])
@require_http_methods(["GET"])
def get_buildings(request):

    buildings = Building.objects
    serializer = BuildingSerializer(buildings, many=True)

    return Response(serializer.data)
