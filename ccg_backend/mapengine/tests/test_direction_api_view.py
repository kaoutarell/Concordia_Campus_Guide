import pytest
from rest_framework.test import APIClient
from django.urls import reverse

MOCK_CORRECT_START = "-73.57814443759847,45.49475992981652"
MOCK_CORRECT_END = "-73.63745344267659,45.459191116866684"
MOCK_SAME_CAMPUS_START="-73.63732331971879,45.45696416140123"
MOCK_SAME_CAMPUS_END="-73.6419572077827,45.45921245764123"
SAME_CAMPUS_PARAMS = f"?start={MOCK_SAME_CAMPUS_START}&end={MOCK_SAME_CAMPUS_END}"
CORRECT_PARAMS = f"?start={MOCK_CORRECT_START}&end={MOCK_CORRECT_END}"
INVALID_PARAMS = "?start=0,0&end=0,0"

@pytest.fixture
def api_client():
    return APIClient()

def test_get_profiles(api_client):
    url = reverse("profiles")
    response = api_client.get(url)
    assert response.status_code == 200
    assert response.json() == {"profiles": ["foot-walking", "cycling-regular", "driving-car", "wheelchair", "public-transport", "concordia-shuttle"]}


def test_foot_walking_directions(api_client):
    check_directions(api_client, "foot-walking")

def test_cycling_regular_directions(api_client):
    check_directions(api_client, "cycling-regular")

def test_driving_car_directions(api_client):
    check_directions(api_client, "driving-car")

def test_wheelchair_directions(api_client):
    check_directions(api_client, "wheelchair")

def test_public_transport_directions(api_client):
    check_directions(api_client, "public-transport")

def check_directions(api_client, profile):
    # Case 1: Missing start or end parameter
    url = reverse(profile)
    response = api_client.get(url)
    assert response.status_code == 400
    assert response.json() == {"error": "Missing start or end parameter"}

    # Case 2: Out of bounds coordinates
    response = api_client.get(url + INVALID_PARAMS)
    assert response.status_code == 400

    # Case 3: In bounds coordinates (For all profiles except concordia-shuttle during weekend)
    from datetime import datetime
    today = datetime.today().weekday()
    if not (profile == "concordia-shuttle" and today >= 5):
        response = api_client.get(url + CORRECT_PARAMS)
        assert response.status_code == 200
        json = response.json()
        assert "profile" in json
        assert "startingCoordinates" in json
        assert "destinationCoordinates" in json
        assert "bbox" in json
        assert "steps" in json
        assert len(json["steps"]) > 0
        for step in json["steps"]:
            assert "distance" in step
            assert "duration" in step
            assert "instruction" in step
            assert "type" in step
            assert "coordinates" in step
            assert len(step["coordinates"]) > 0
            for coord in step["coordinates"]:
                assert len(coord) == 2


def test_concordia_shuttle_directions(api_client):
    url = reverse("concordia-shuttle")

    # Case 1: Missing start or end parameter
    response = api_client.get(url)
    assert response.status_code == 400
    assert response.json() == {"error": "Missing start or end parameter"}

    # Case 2: Invalid coordinates
    response = api_client.get(url + INVALID_PARAMS)
    assert response.status_code == 400

    # Case 3: Valid coordinates
    response = api_client.get(url + CORRECT_PARAMS)
    assert response.status_code == 200
    json = response.json()

    # Check top-level fields
    assert "total_distance" in json and isinstance(json["total_distance"], (int, float))
    assert "total_duration" in json and isinstance(json["total_duration"], (int, float))
    assert "bbox" in json and isinstance(json["bbox"], list) and len(json["bbox"]) == 4
    assert "legs" in json and isinstance(json["legs"], dict)
    assert set(json["legs"].keys()) == {"walk_to_stop", "shuttle_ride", "walk_from_stop"}

    # Check each leg
    for leg_name, expected_profile in [
        ("walk_to_stop", "foot-walking"),
        ("shuttle_ride", "driving-car"),
        ("walk_from_stop", "foot-walking")
    ]:
        leg = json["legs"][leg_name]
        assert "profile" in leg and leg["profile"] == expected_profile
        assert "steps" in leg and isinstance(leg["steps"], list)
        for step in leg["steps"]:
            assert "distance" in step
            assert "duration" in step
            assert "instruction" in step
            assert "type" in step
            assert "coordinates" in step and isinstance(step["coordinates"], list)
            assert len(step["coordinates"]) > 0
            for coord in step["coordinates"]:
                assert len(coord) == 2

    # Check additional fields
    assert "origin_building" in json
    assert "destination_building" in json
    assert "origin_campus" in json
    assert "destination_campus" in json


def test_concordia_shuttle_same_campus(api_client):
    url = reverse("concordia-shuttle")
    response = api_client.get(url + SAME_CAMPUS_PARAMS)
    assert response.status_code == 200
    json = response.json()
    # Should fall back to walking directions
    assert "profile" in json and json["profile"] == "foot-walking"
    assert "steps" in json and isinstance(json["steps"], list)