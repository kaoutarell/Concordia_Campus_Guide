import requests
import json
from django.http import JsonResponse
from rest_framework.decorators import api_view
from collections import deque
import numpy as np

@api_view(['GET'])
def get_indoor_directions(request):
    print(get_node_sequence("H867", "H827"))
    path = {"path_data": "M50,150 C150,50 350,50 450,150"}
    return JsonResponse(path)

def get_node_sequence(start, destination):
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

#this function returns the closest point in the hallway to the class in order to connect the two graphically
def get_hallway_class_point(map_data, room):
    corner1=map_data[room]["connections"][1]
    corner2=map_data[room]["connections"][2]
    A=(map_data[corner1]["coordinate"]["x"], map_data[room]["coordinate"]["y"])
    B=(map_data[corner2]["coordinate"]["x"], map_data[room]["coordinate"]["y"])
    P=(map_data[room]["coordinate"]["x"], map_data[room]["coordinate"]["y"])
    
    A = np.array(A)
    B = np.array(B)
    P = np.array(P)

    AB = B - A  # Direction vector of line
    AP = P - A  # Vector from A to P

    t = np.dot(AP, AB) / np.dot(AB, AB)  # Projection scalar
    Q = A + t * AB  # Compute closest point

    return tuple(Q)