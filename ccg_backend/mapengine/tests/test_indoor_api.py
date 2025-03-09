import json
import os
import pytest

from ..utils.indoor_direction_api_utils import get_pins, get_floor_sequence, get_hallway_class_point, get_node_sequence, get_path_coordinates, convert_coords_to_output, select_map


FIXTURE_PATH = os.path.join(os.path.dirname(__file__), "../fixtures/H8.json")

def test_get_pins():
    with open(FIXTURE_PATH, "r") as file:
        map_data = json.load(file)
    pins = get_pins(map_data, "H867", "H837", False)
    assert pins == [[75, 105], [640, 900]]
    pins = get_pins(map_data, "H867", "H837", True)
    assert pins == [[75, 105]]


def test_get_node_sequence():
    with open(FIXTURE_PATH, "r") as file:
        map_data = json.load(file)
    sequence = get_node_sequence(map_data, "H867", "H813")
    assert sequence == ["H867", "C1", "C2", "H813"]
    sequence = get_node_sequence(map_data, "H800", "H813")
    assert sequence is None


def test_get_hallway_class_point():
    with open(FIXTURE_PATH, "r") as file:
        map_data = json.load(file)
    point = get_hallway_class_point(map_data, "H813")
    assert point == (765, 220)


def test_get_path_coordinates():
    with open(FIXTURE_PATH, "r") as file:
        map_data = json.load(file)
    sequence = ["H867", "C1", "C2", "H813"]
    coords = get_path_coordinates(map_data, sequence)
    assert coords == [
        {"x": 160, "y": 200},
        {"x": 180, "y": 220},
        {"x": 180, "y": 220},
        {"x": 555, "y": 220},
        {"x": 765, "y": 220},
        {"x": 765, "y": 195},
    ]


def test_convert_coords_to_output():
    coords = [
        {"x": 160, "y": 200},
        {"x": 180, "y": 220},
        {"x": 180, "y": 220},
        {"x": 555, "y": 220},
        {"x": 765, "y": 220},
        {"x": 765, "y": 195},
    ]
    output = convert_coords_to_output(coords)
    assert output == "M160 200 L180 220 L180 220 L555 220 L765 220 L765 195"


def test_select_map():
    with open(FIXTURE_PATH, "r") as file:
        map_data = json.load(file)
    assert map_data == select_map("H8")
    assert select_map("doesntexist") is None


def test_get_floor_sequence():
    sequence = get_floor_sequence("H867", "H967")
    assert sequence == ["H8", "H9"]
