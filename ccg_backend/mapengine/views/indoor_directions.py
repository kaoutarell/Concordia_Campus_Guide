import requests
import json
from django.http import JsonResponse
from rest_framework.decorators import api_view
from collections import deque

@api_view(['GET'])
def get_indoor_directions(request):
    print(get_indoor_path("H867", "H827"))
    path = {"path_data": "M50,150 C150,50 350,50 450,150"}
    return JsonResponse(path)

def get_indoor_path(start, destination):
    with open('mapengine/fixtures/h8.json', 'r') as file:
        map_data=json.load(file)
    if start not in map_data or destination not in map_data:
        return None
    
    queue = deque([(start, [start])])
    visited = set()
    
    while queue:
        current_node, path = queue.popleft()
        if current_node == destination:
            return path
        
        if current_node not in visited:
            visited.add(current_node)
            for neighbor in map_data[current_node]['connections']:
                if neighbor not in visited:
                    queue.append((neighbor, path + [neighbor]))
    
    return None

    print(map_data["H867"])