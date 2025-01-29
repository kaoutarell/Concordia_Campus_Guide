from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Building, ShuttleStop, Route
from .serializers import BuildingSerializer, ShuttleStopSerializer, RouteSerializer
from django.views.decorators.csrf import csrf_exempt

# List and create endpoints for Buildings
@api_view(['GET', 'POST'])
@csrf_exempt
def building_list_create(request):
    if request.method == 'GET':
        buildings = Building.objects.all()
        serializer = BuildingSerializer(buildings, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = BuildingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# List and create endpoints for Shuttle Stops
@api_view(['GET', 'POST'])
@csrf_exempt
def shuttlestop_list_create(request):
    if request.method == 'GET':
        shuttlestops = ShuttleStop.objects.all()
        serializer = ShuttleStopSerializer(shuttlestops, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = ShuttleStopSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# List and create endpoints for Routes
@api_view(['GET', 'POST'])
@csrf_exempt
def route_list_create(request):
    if request.method == 'GET':
        routes = Route.objects.all()
        serializer = RouteSerializer(routes, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = RouteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)