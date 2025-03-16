import json
from collections import deque

import numpy as np

""" main function of this file. returns a dictionary with all the data needed by the client
    example output:
    {
        'floor_sequence': ['H8'], ==> sequence of floors to be traveled to get from point A to B
        'path_data': 'M160 200 L180 220 L555 800 L675 800 L675 820', ==> path data for the <Path> tag on the frontend
        'pin': [[75, 105], [640, 900]] ==> array of pins to be displayed on the frontend to show point A and B
    }
"""
last_used_stairs = ""

def get_indoor_directions_data(request):
    start = request.GET.get("start")
    destination = request.GET.get("destination")

    floor_sequence = get_floor_sequence(start, destination)
    if floor_sequence is None:
        return None

    data = {"floor_sequence":floor_sequence, "path_data":{}, "pin":{}}

    global last_used_stairs
    last_used_stairs=""
    map_data=None
    sequence=None

    i=0
    while i<len(floor_sequence):
        if floor_sequence[i] != "outside":
            map_data = select_map(floor_sequence[i])
            if map_data is None:
                print("no map data")
                return None
        else:
            last_used_stairs=""
            continue
    #If there is only one floor
        if len(floor_sequence) == 1:
            sequence = get_node_sequence(map_data, start, destination)
            pin_array = get_pins(map_data, start, destination)
    #If there is a floor after the current
        elif len(floor_sequence)>i+1 and floor_sequence[i+1] != "outside":
            print("1")
            if last_used_stairs == "":
                sequence = get_class_stair_sequence(map_data, start)
                print("last stairs used: "+last_used_stairs)
                pin_array = get_pins(map_data, start, last_used_stairs)
    #If the current floor is between two floors
            else:
                sequence = get_node_sequence(map_data, last_used_stairs, last_used_stairs)
                pin_array = get_pins(map_data, last_used_stairs, last_used_stairs)
    #If there is a floor before the current
        elif i>0 and floor_sequence[i-1] != "outside":
            print("2")
            sequence = get_node_sequence(map_data, last_used_stairs, destination)
            pin_array = get_pins(map_data, last_used_stairs, destination)

        if sequence is None:
            print("no sequence")
            return None

        coords = get_path_coordinates(map_data, sequence)
        path_data = convert_coords_to_output(coords)
        
        data["path_data"][floor_sequence[i]]=path_data
        data["pin"][floor_sequence[i]]=pin_array

        i+=1
    print(data)
    return data


# returns an array of pins for the start and destination if it isn't a multifloor request
def get_pins(map_data, start, destination):
    if "pin" not in map_data[start] or "pin" not in map_data[destination]:
        return None
    pin = [[map_data[start]["pin"]["x"], map_data[start]["pin"]["y"]]]

    
    pin.append(
        [map_data[destination]["pin"]["x"], map_data[destination]["pin"]["y"]]
    )
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
            for neighbor in map_data[current_node]["connections"]:
                if neighbor not in visited:
                    queue.append((neighbor, path + [neighbor]))

    return None


# returns a sequence of nodes from a classroom to a stairwell

def get_class_stair_sequence(map_data, classroom):

    global last_used_stairs

    if classroom not in map_data:
        return None

    queue = deque([(classroom, [classroom])])
    visited = set()

    while queue:
        current_node, path = queue.popleft()
        if map_data[current_node]['type'] == 'stairs':
            last_used_stairs=map_data[current_node]["id"]
            print(last_used_stairs)
            return path

        if current_node not in visited:
            visited.add(current_node)
            for neighbor in map_data[current_node]['connections']:
                if neighbor not in visited:
                    queue.append((neighbor, path + [neighbor]))

    return None



# this function returns the closest point in the hallway to the class in order to connect the two graphically
def get_hallway_class_point(map_data, room):
    corner1 = map_data[room]["connections"][0]
    corner2 = map_data[room]["connections"][1]

    A = (map_data[corner1]["coords"]["x"], map_data[corner1]["coords"]["y"])
    B = (map_data[corner2]["coords"]["x"], map_data[corner2]["coords"]["y"])
    P = (map_data[room]["coords"]["x"], map_data[room]["coords"]["y"])

    A, B, P = (
        np.array(A, dtype=float),
        np.array(B, dtype=float),
        np.array(P, dtype=float),
    )

    AB = B - A
    AP = P - A

    ab_squared = np.dot(AB, AB)
    if ab_squared == 0:
        print("Degenerate line segment:", A)
        return tuple(A)

    t = np.dot(AP, AB) / ab_squared
    t = max(0, min(1, t))
    Q = A + t * AB

    return tuple(Q)


# returns the list of coordinates for the path between two rooms
def get_path_coordinates(map_data, path):
    coords = []
    print(path)
    coords.append(map_data[path[0]]["coords"])
    if map_data[path[1]]["type"] != "corner":
        coords.append(map_data[path[1]]["coords"])
        return coords
    else:
        p = get_hallway_class_point(map_data, path[0])
        coords.append({"x": int(p[0]), "y": int(p[1])})
        i = 1
        while map_data[path[i]]["type"] == "corner":
            coords.append(map_data[path[i]]["coords"])
            i = i + 1
        p = get_hallway_class_point(map_data, path[i])
        coords.append({"x": int(p[0]), "y": int(p[1])})
        coords.append(map_data[path[i]]["coords"])
        return coords


# converts the array of coordinates to proper output format
def convert_coords_to_output(coords):
    output = "M" + str(coords[0]["x"]) + " " + str(coords[0]["y"])
    output += " L" + str(coords[1]["x"]) + " " + str(coords[1]["y"])
    i = 2
    while i < len(coords):
        output += " L" + str(coords[i]["x"]) + " " + str(coords[i]["y"])
        i += 1
    return output


# returns the json graph associated with the floor
def select_map(floor):
    try:
        with open("mapengine/fixtures/IndoorMaps/" + floor + ".json", "r") as file:
            map_data = json.load(file)
        return map_data
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"Error loading map data for floor {floor}: {e}")
        return None


# returns a sequence of floors to be traveled to get from point A to B
def get_floor_sequence(start, destination):
    with open("mapengine/fixtures/IndoorMaps/floor_connection_graph.json", "r") as file:
        floor_graph = json.load(file)
    for key in floor_graph:
        if start.startswith(key):
            start = key
        if destination.startswith(key):
            destination = key
    sequence = get_node_sequence(floor_graph, start, destination)
    return sequence
