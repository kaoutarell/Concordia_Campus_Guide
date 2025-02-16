from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ..models.route import Route
from ..serializers.route_serializer import RouteSerializer
from django.views.decorators.http import require_http_methods

@api_view(['GET'])
@require_http_methods(['GET'])
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