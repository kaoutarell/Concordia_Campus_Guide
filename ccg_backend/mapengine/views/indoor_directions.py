import requests
from django.http import JsonResponse
from rest_framework.decorators import api_view

@api_view(['GET'])
def get_indoor_directions(request):
    path = {"path_data": "M50,150 C150,50 350,50 450,150"}
    return JsonResponse(path)