from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ..models.building import Building
from ..serializers.building_serializer import BuildingSerializer
from django.views.decorators.csrf import csrf_exempt

@api_view(['GET'])
@csrf_exempt
def get_buildings_by_campus(request):
    campus_name = request.GET.get('campus')

    if not campus_name:
        return Response({"error": "Missing campus parameter"}, status=400)

    buildings = Building.objects.filter(campus__iexact=campus_name)
    serializer = BuildingSerializer(buildings, many=True)

    return Response(serializer.data)