from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ..models.building import Building
from django.views.decorators.http import require_http_methods
from ..models.service import Service
from ..serializers.service_serializer import ServiceSerializer


@api_view(['GET'])
@require_http_methods(['GET'])
def get_all_services(request):
    services = Service.objects.all()
    serializer = ServiceSerializer(services, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@require_http_methods(['GET'])
def get_services_by_building(request):
    building_id = request.GET.get('building_id')
    if not building_id:
        return Response({"error": "Missing building_id parameter"}, status=400)
    services = Service.objects.filter(building=building_id)
    serializer = ServiceSerializer(services, many=True)
    return Response(serializer.data)