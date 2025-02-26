import requests
import json
from django.http import JsonResponse
from rest_framework.decorators import api_view
from collections import deque
import numpy as np

@api_view(['GET'])
def get_indoor_directions(request):
    with open('mapengine/fixtures/h8.json', 'r') as file:
        map_data=json.load(file)
    sequence=get_node_sequence(map_data, "H867", "H827")
    print(get_path_coordinates(map_data, sequence))
    path = {"path_data": "M50,150 C150,50 350,50 450,150"}
    return JsonResponse(path)

def get_node_sequence(map_data, start, destination):
    
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
    corner1=map_data[room]["connections"][0]
    corner2=map_data[room]["connections"][1]
    A=(map_data[corner1]["coords"]["x"], map_data[corner1]["coords"]["y"])
    B=(map_data[corner2]["coords"]["x"], map_data[corner2]["coords"]["y"])
    P=(map_data[room]["coords"]["x"], map_data[room]["coords"]["y"])
    
    A = np.array(A)
    B = np.array(B)
    P = np.array(P)

    AB = B - A  # Direction vector of line
    AP = P - A  # Vector from A to P

    t = np.dot(AP, AB) / np.dot(AB, AB)  # Projection scalar
    Q = A + t * AB  # Compute closest point

    return tuple(Q)

#returns the list of coordinates for the path between two rooms
def get_path_coordinates(map_data, path):
    coords=[]
    coords.append(map_data[path[0]]["coords"])
    if map_data[path[1]]["type"]=="room":
        coords.append(map_data[path[1]]["coords"])
        return coords
    else:
        p = get_hallway_class_point(map_data, path[0])
        coords.append({"x":int(p[0]), "y":int(p[1])})
        i=2
        while map_data[path[i]]["type"] != "room":
            if map_data[path[i+1]]["type"] == "room":
                p = get_hallway_class_point(map_data, path[i+1])
                coords.append({"x":int(p[0]), "y":int(p[1])})
            else:
                coords.append(map_data[path[i]]["coords"])
            i=i+1
        coords.append(map_data[path[i]]["coords"])
        return coords