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