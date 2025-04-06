import json
import os

import pytest

from ..utils.indoor_direction_api_utils import (
    convert_coords_to_output,
    get_class_stair_sequence,
    get_floor_sequence,
    get_hallway_class_point,
    get_indoor_directions_data,
    get_node_sequence,
    get_path_coordinates,
    get_pins,
    select_map,
)

MAP_DATA = {
    "H867": {
        "id": "H867",
        "type": "room",
        "pin": {"x": 75, "y": 105},
        "coords": {"x": 160, "y": 200},
        "connections": ["C1", "C7"],
    },
    "H865": {
        "id": "H865",
        "type": "room",
        "pin": {"x": 75, "y": 175},
        "coords": {"x": 160, "y": 200},
        "connections": ["C1", "C7"],
    },
    "H863": {
        "id": "H863",
        "type": "room",
        "pin": {"x": 75, "y": 240},
        "coords": {"x": 160, "y": 200},
        "connections": ["C1", "C7"],
    },
    "H861": {
        "id": "H861",
        "type": "room",
        "pin": {"x": 75, "y": 325},
        "coords": {"x": 160, "y": 355},
        "connections": ["C1", "C7"],
    },
    "H859": {
        "id": "H859",
        "type": "room",
        "pin": {"x": 75, "y": 420},
        "coords": {"x": 160, "y": 385},
        "connections": ["C1", "C7"],
    },
    "H857": {
        "id": "H857",
        "type": "room",
        "pin": {"x": 75, "y": 510},
        "coords": {"x": 160, "y": 480},
        "connections": ["C7", "C4"],
    },
    "H855": {
        "id": "H855",
        "type": "room",
        "pin": {"x": 75, "y": 600},
        "coords": {"x": 160, "y": 570},
        "connections": ["C7", "C4"],
    },
    "H853": {
        "id": "H853",
        "type": "room",
        "pin": {"x": 75, "y": 690},
        "coords": {"x": 160, "y": 720},
        "connections": ["C7", "C4"],
    },
    "H851.01": {
        "id": "H851.01",
        "type": "room",
        "pin": {"x": 130, "y": 760},
        "coords": {"x": 160, "y": 810},
        "connections": ["C7", "C4"],
    },
    "H851.02": {
        "id": "H851.02",
        "type": "room",
        "pin": {"x": 60, "y": 760},
        "coords": {"x": 160, "y": 810},
        "connections": ["C7", "C4"],
    },
    "H851.03": {
        "id": "H851.03",
        "type": "room",
        "pin": {"x": 50, "y": 810},
        "coords": {"x": 160, "y": 810},
        "connections": ["C7", "C4"],
    },
    "H849": {
        "id": "H849",
        "type": "room",
        "pin": {"x": 75, "y": 900},
        "coords": {"x": 160, "y": 810},
        "connections": ["C7", "C4"],
    },
    "H847": {
        "id": "H847",
        "type": "room",
        "pin": {"x": 200, "y": 900},
        "coords": {"x": 225, "y": 820},
        "connections": ["C4", "C5"],
    },
    "H845": {
        "id": "H845",
        "type": "room",
        "pin": {"x": 285, "y": 900},
        "coords": {"x": 255, "y": 820},
        "connections": ["C4", "C5"],
    },
    "H843": {
        "id": "H843",
        "type": "room",
        "pin": {"x": 370, "y": 900},
        "coords": {"x": 340, "y": 820},
        "connections": ["C4", "C5"],
    },
    "H841": {
        "id": "H841",
        "type": "room",
        "pin": {"x": 465, "y": 900},
        "coords": {"x": 500, "y": 820},
        "connections": ["C4", "C5"],
    },
    "H839": {
        "id": "H839",
        "type": "room",
        "pin": {"x": 555, "y": 900},
        "coords": {"x": 555, "y": 820},
        "connections": ["C5"],
    },
    "H837": {
        "id": "H837",
        "type": "room",
        "pin": {"x": 640, "y": 900},
        "coords": {"x": 675, "y": 820},
        "connections": ["C5", "C6"],
    },
    "H835": {
        "id": "H835",
        "type": "room",
        "pin": {"x": 740, "y": 900},
        "coords": {"x": 705, "y": 820},
        "connections": ["C5", "C6"],
    },
    "H833": {
        "id": "H833",
        "type": "room",
        "pin": {"x": 830, "y": 900},
        "coords": {"x": 800, "y": 820},
        "connections": ["C5", "C6"],
    },
    "H831": {
        "id": "H831",
        "type": "room",
        "pin": {"x": 940, "y": 900},
        "coords": {"x": 865, "y": 820},
        "connections": ["C5", "C6"],
    },
    "H829": {
        "id": "H829",
        "type": "room",
        "coords": {"x": 865, "y": 870},
        "connections": ["C3", "C6"],
    },
    "H827": {
        "id": "H827",
        "type": "room",
        "coords": {"x": 865, "y": 565},
        "connections": ["C3", "C6"],
    },
    "H825": {
        "id": "H825",
        "type": "room",
        "coords": {"x": 865, "y": 535},
        "connections": ["C3", "C6"],
    },
    "H823": {
        "id": "H823",
        "type": "room",
        "coords": {"x": 865, "y": 385},
        "connections": ["C3", "C6"],
    },
    "H821": {
        "id": "H821",
        "type": "room",
        "coords": {"x": 865, "y": 355},
        "connections": ["C3", "C6"],
    },
    "H819": {
        "id": "H819",
        "type": "room",
        "coords": {"x": 865, "y": 210},
        "connections": ["C3", "C6"],
    },
    "H817": {
        "id": "H817",
        "type": "room",
        "coords": {"x": 865, "y": 185},
        "connections": ["C3", "C6"],
    },
    "H815": {
        "id": "H815",
        "type": "room",
        "coords": {"x": 865, "y": 185},
        "connections": ["C3", "C6"],
    },
    "H813": {
        "id": "H813",
        "type": "room",
        "coords": {"x": 765, "y": 195},
        "connections": ["C2", "C3"],
    },
    "H811": {
        "id": "H811",
        "type": "room",
        "coords": {"x": 680, "y": 195},
        "connections": ["C2", "C3"],
    },
    "H809": {
        "id": "H809",
        "type": "room",
        "coords": {"x": 555, "y": 195},
        "connections": ["C2"],
    },
    "H807": {
        "id": "H807",
        "type": "room",
        "coords": {"x": 500, "y": 195},
        "connections": ["C1", "C2"],
    },
    "H805.01": {
        "id": "H805.01",
        "type": "room",
        "coords": {"x": 345, "y": 195},
        "connections": ["C1", "C2"],
    },
    "H805.02": {
        "id": "H805.02",
        "type": "room",
        "coords": {"x": 345, "y": 195},
        "connections": ["C1", "C2"],
    },
    "H805.03": {
        "id": "H805.03",
        "type": "room",
        "coords": {"x": 345, "y": 195},
        "connections": ["C1", "C2"],
    },
    "H803": {
        "id": "H803",
        "type": "room",
        "coords": {"x": 320, "y": 195},
        "connections": ["C1", "C2"],
    },
    "H801": {
        "id": "H801",
        "type": "room",
        "coords": {"x": 225, "y": 195},
        "connections": ["C1", "C2"],
    },
    "S1": {
        "id": "S1",
        "type": "stairs",
        "pin": {"x": 250, "y": 320},
        "coords": {"x": 275, "y": 380},
        "connections": ["C7", "C8"],
    },
    "E1": {
        "id": "E1",
        "type": "elevator",
        "pin": {"x": 360, "y": 350},
        "coords": {"x": 360, "y": 380},
        "connections": ["C7", "C8"],
    },
    "C1": {
        "id": "C1",
        "type": "corner",
        "coords": {"x": 180, "y": 220},
        "connections": ["C2", "C4", "C7", "H867", "H865", "H863", "H861", "H859"],
    },
    "C2": {
        "id": "C2",
        "type": "corner",
        "coords": {"x": 555, "y": 220},
        "connections": [
            "C1",
            "C3",
            "C5",
            "C8",
            "H801",
            "H803",
            "H805.01",
            "H805.02",
            "H805.03",
            "H807",
            "H811",
            "H813",
            "H815",
        ],
    },
    "C3": {
        "id": "C3",
        "type": "corner",
        "coords": {"x": 845, "y": 220},
        "connections": [
            "C2",
            "C6",
            "H811",
            "H813",
            "H815",
            "H817",
            "H819",
            "H821",
            "H823",
            "H825",
            "H827",
            "H829",
            "H831",
        ],
    },
    "C4": {
        "id": "C4",
        "type": "corner",
        "coords": {"x": 180, "y": 800},
        "connections": [
            "C1",
            "C5",
            "C7",
            "H857",
            "H855",
            "H853",
            "H851.01",
            "H851.02",
            "H851.03",
            "H849",
            "H847",
            "H845",
            "H843",
            "H841",
        ],
    },
    "C5": {
        "id": "C5",
        "type": "corner",
        "coords": {"x": 555, "y": 800},
        "connections": [
            "C2",
            "C4",
            "C6",
            "C8",
            "H847",
            "H845",
            "H843",
            "H841",
            "H839",
            "H837",
            "H835",
            "H833",
        ],
    },
    "C6": {
        "id": "C6",
        "type": "corner",
        "coords": {"x": 845, "y": 800},
        "connections": [
            "C3",
            "C5",
            "H819",
            "H821",
            "H823",
            "H825",
            "H827",
            "H829",
            "H831",
            "H833",
            "H835",
            "H837",
        ],
    },
    "C7": {
        "id": "C7",
        "type": "corner",
        "coords": {"x": 180, "y": 400},
        "connections": [
            "C1",
            "C4",
            "C8",
            "H867",
            "H865",
            "H863",
            "H861",
            "H859",
            "H857",
            "H855",
            "H853",
            "H851.01",
            "H851.02",
            "H851.03",
            "H849",
            "H801",
            "H803",
            "H805.01",
            "H805.02",
            "H805.03",
            "H807",
            "S1",
            "E1",
        ],
    },
    "C8": {
        "id": "C8",
        "type": "corner",
        "coords": {"x": 555, "y": 400},
        "connections": ["C2", "C5", "C7", "S1", "E1"],
    },
}


def test_get_pins():
    map_data = MAP_DATA
    pins = get_pins(map_data, "H867", "H837")
    assert pins == [[75, 105], [640, 900]]
    pins = get_pins(map_data, "H867", "H827")
    assert pins is None


def test_get_node_sequence():
    map_data = MAP_DATA
    sequence = get_node_sequence(map_data, "H867", "H813")
    assert sequence == ["H867", "C1", "C2", "H813"]
    sequence = get_node_sequence(map_data, "H800", "H813")
    assert sequence is None


def test_get_hallway_class_point():
    map_data = MAP_DATA
    point = get_hallway_class_point(map_data, "H813")
    assert point == (765, 220)


def test_get_path_coordinates():
    map_data = MAP_DATA
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


"""def test_select_map():
    map_data = MAP_DATA
    assert map_data == select_map("H8")
    assert select_map("doesntexist") is None
"""


def test_get_floor_sequence():
    sequence = get_floor_sequence("H867", "H967")
    assert sequence == ["H8", "H9"]


def test_get_class_stairs_sequence():
    sequence = get_class_stair_sequence(MAP_DATA, "H867")
    assert sequence == ["H867", "C7", "E1"]


def test_get_indoor_direction_data():
    data = get_indoor_directions_data("H867", "H837", "false")
    assert data == {
        "floor_sequence": ["H8"],
        "path_data": {
            "H8": "M160 200 L180 220 L180 400 L180 800 L555 800 L675 800 L675 820"
        },
        "pin": {"H8": [[75, 105], [640, 900]]},
    }
    data = get_indoor_directions_data("H867", "H913", "false")
    assert data["floor_sequence"] == ["H8", "H9"]
    data = get_indoor_directions_data("H913", "MB1.210", "false")
    assert data == {
        "floor_sequence": ["H9", "H8", "H2", "H1", "Outside", "MB1"],
        "path_data": {
            "H9": "M740 200 L740 225 L530 225 L530 405 L265 405 L265 385",
            "H8": "M275 380",
            "H2": "M195 415",
            "H1": "M150 235 L150 250 L530 250 L530 900 L325 900 L325 960",
            "MB1": "M505 145 L465 165 L465 165 L465 420 L348 431 L350 450",
        },
        "pin": {
            "H9": [[740, 125], [265, 340]],
            "H8": [[250, 320], [250, 320]],
            "H2": [[220, 385], [220, 385]],
            "H1": [[185, 185], [325, 1000]],
            "MB1": [[430, 100], [345, 645]],
        },
    }
    data = get_indoor_directions_data("MB1.210", "H913", "false")
    assert data == {
        "floor_sequence": ["MB1", "Outside", "H1", "H2", "H8", "H9"],
        "path_data": {
            "MB1": "M460 500 L276 439",
            "H1": "M325 960 L325 900 L530 900 L530 250 L150 250 L150 235",
            "H2": "M195 415",
            "H8": "M275 380",
            "H9": "M265 385 L265 405 L530 405 L530 225 L740 225 L740 200",
        },
        "pin": {
            "MB1": [[345, 645], [430, 100]],
            "H1": [[325, 1000], [185, 185]],
            "H2": [[220, 385], [220, 385]],
            "H8": [[250, 320], [250, 320]],
            "H9": [[265, 340], [740, 125]],
        },
    }
    data = get_indoor_directions_data("H913", "H867", "true")
    assert data["floor_sequence"] == ["H9", "H8"]
