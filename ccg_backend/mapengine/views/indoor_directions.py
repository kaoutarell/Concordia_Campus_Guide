import requests
import json
from django.http import JsonResponse
from rest_framework.decorators import api_view

@api_view(['GET'])
def get_indoor_directions(request):
    get_indoor_path()
    path = {"path_data": "M50,150 C150,50 350,50 450,150"}
    return JsonResponse(path)

def get_indoor_path():
    with open('mapengine/fixtures/h8.json', 'r') as file:
        map_data=json.load(file)

    print(map_data["H867"])