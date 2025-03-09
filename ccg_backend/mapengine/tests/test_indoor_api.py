import json
import pytest
from ..utils.indoor_direction_api_utils import *

def test_get_pins():
    with open('mapengine/fixtures/H8.json', 'r') as file:
        map_data=json.load(file)
    pins=get_pins(map_data, 'H867', 'H837', False)
    assert pins == [[75, 105], [640, 900]]
    pins=get_pins(map_data, 'H867', 'H837', True)
    assert pins == [[75, 105]]

def test_get_node_sequence():
    with open('mapengine/fixtures/H8.json', 'r') as file:
        map_data=json.load(file)
    sequence=get_node_sequence(map_data, 'H867', 'H813')
    assert sequence==['H867', 'C1', 'C2', 'H813']
    sequence=get_node_sequence(map_data, 'H800', 'H813')
    assert sequence==None

def test_get_hallway_class_point():
    with open('mapengine/fixtures/H8.json', 'r') as file:
        map_data=json.load(file)
    point=get_hallway_class_point(map_data, 'H813')
    assert point==(765, 220)

def test_get_path_coordinates():
    with open('mapengine/fixtures/H8.json', 'r') as file:
        map_data=json.load(file)
    sequence = ['H867', 'C1', 'C2', 'H813']
    coords = get_path_coordinates(map_data, sequence)
    assert coords == [{'x': 160, 'y': 200}, {'x': 180, 'y': 220}, {'x': 180, 'y': 220}, {'x': 555, 'y': 220}, {'x': 765, 'y': 220}, {'x': 765, 'y': 195}]

def test_convert_coords_to_output():
    coords = [{'x': 160, 'y': 200}, {'x': 180, 'y': 220}, {'x': 180, 'y': 220}, {'x': 555, 'y': 220}, {'x': 765, 'y': 220}, {'x': 765, 'y': 195}]
    output = convert_coords_to_output(coords)
    assert output == 'M160 200 L180 220 L180 220 L555 220 L765 220 L765 195'