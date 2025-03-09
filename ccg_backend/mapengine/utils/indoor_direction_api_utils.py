from collections import deque
import json
import numpy as np


''' main function of this file. returns a dictionary with all the data needed by the client
    example output:
    {
        'floor_sequence': ['H8'], ==> sequence of floors to be traveled to get from point A to B
        'path_data': 'M160 200 L180 220 L555 800 L675 800 L675 820', ==> path data for the <Path> tag on the frontend
        'pin': [[75, 105], [640, 900]] ==> array of pins to be displayed on the frontend to show point A and B
    }
'''
def get_indoor_directions_data(request):
    start=request.GET.get('start')
    destination=request.GET.get('destination')

    floor_sequence=get_floor_sequence(request)
    if floor_sequence==None:return None

    map_data=select_map(floor_sequence[0])
    if map_data==None:return None

    sequence=get_node_sequence(map_data, start, destination)
    if sequence==None:return None

    coords=get_path_coordinates(map_data, sequence)
    print(coords)
    path_data=convert_coords_to_output(coords)
    pin_array=get_pins(map_data, start, destination, False)
    data = {"floor_sequence": floor_sequence, "path_data": path_data, "pin": pin_array}
    return data

# returns an array of pins for the start and destination if it isn't a multifloor request
def get_pins(map_data, start, destination, multifloor):
    if "pin" not in map_data[start] or "pin" not in map_data[destination]:return None
    pin=[
        [map_data[start]['pin']['x'], map_data[start]['pin']['y']]
    ]

    if multifloor == False :
        pin.append([map_data[destination]['pin']['x'], map_data[destination]['pin']['y']])
    return pin

# returns a sequence of nodes in a graph when given the start and destination nodes using BFS
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

# returns a sequence of nodes from a classroom to a stairwell
'''
def get_class_stair_sequence(map_data, classroom):
    
    if classroom not in map_data:
        return None
    
    queue = deque([(classroom, [classroom])])
    visited = set()

    while queue:
        current_node, path = queue.popleft()
        if current_node['type'] == 'stairs':
            return path
        
        if current_node not in visited:
            visited.add(current_node)
            for neighbor in map_data[current_node]['connections']:
                if neighbor not in visited:
                    queue.append((neighbor, path + [neighbor]))
    
    return None
'''

#this function returns the closest point in the hallway to the class in order to connect the two graphically
def get_hallway_class_point(map_data, room):
    corner1 = map_data[room]["connections"][0]
    corner2 = map_data[room]["connections"][1]

    A = (map_data[corner1]["coords"]["x"], map_data[corner1]["coords"]["y"])
    B = (map_data[corner2]["coords"]["x"], map_data[corner2]["coords"]["y"])
    P = (map_data[room]["coords"]["x"], map_data[room]["coords"]["y"])

    A, B, P = np.array(A, dtype=float), np.array(B, dtype=float), np.array(P, dtype=float)

    AB = B - A
    AP = P - A

    AB_squared = np.dot(AB, AB)
    if AB_squared == 0:
        print("Degenerate line segment:", A)
        return tuple(A)

    t = np.dot(AP, AB) / AB_squared
    t = max(0, min(1, t))
    Q = A + t * AB  

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
        i=1
        while map_data[path[i]]["type"] != "room":
            if map_data[path[i]]["type"] == "room":
                p = get_hallway_class_point(map_data, path[i])
                coords.append({"x":int(p[0]), "y":int(p[1])})
            else:
                coords.append(map_data[path[i]]["coords"])
            i=i+1
        p = get_hallway_class_point(map_data, path[i])
        coords.append({"x":int(p[0]), "y":int(p[1])})
        coords.append(map_data[path[i]]["coords"])
        return coords

#converts the array of coordinates to proper output format    
def convert_coords_to_output(coords):
    output="M"+str(coords[0]["x"])+" "+str(coords[0]["y"])
    output+=" L"+str(coords[1]["x"])+" "+str(coords[1]["y"])
    i=2
    while i<len(coords):
        output+=" L"+str(coords[i]["x"])+" "+str(coords[i]["y"])
        i+=1
    return output

# returns the json graph associated with the floor
def select_map(floor):
    try:
        with open('mapengine/fixtures/'+floor+'.json', 'r') as file:
            map_data=json.load(file)
        return map_data
    except:
        return None
    
# returns a sequence of floors to be traveled to get from point A to B
def get_floor_sequence(request):
    start = request.GET.get('start')
    destination = request.GET.get('destination')
    with open('mapengine/fixtures/floor_connection_graph.json', 'r') as file:
        floor_graph=json.load(file)
    for key in floor_graph:
        if start.startswith(key):
            start=key
        if destination.startswith(key):
            destination=key
    sequence=get_node_sequence(floor_graph, start, destination)
    return sequence