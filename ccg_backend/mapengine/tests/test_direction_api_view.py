import pytest
from rest_framework.test import APIClient
from django.urls import reverse

MOCK_CORRECT_START = "-73.57814443759847,45.49475992981652"
MOCK_CORRECT_END = "-73.63745344267659,45.459191116866684"
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

def test_concordia_shuttle_directions(api_client):
    check_directions(api_client, "concordia-shuttle")

def check_directions(api_client, profile):
    # Case 1: Missing start or end parameter
    url = reverse(profile)
    response = api_client.get(url)
    assert response.status_code == 400
    assert response.json() == {"error": "Missing start or end parameter"}

    # Case 2: Out of bounds coordinates
    response = api_client.get(url + INVALID_PARAMS)
    assert response.status_code == 400

    # Case 3.1: In bounds coordinates (For concordia-shuttle during weekend)
    from datetime import datetime
    today = datetime.today().weekday()

    if profile=="concordia-shuttle" and today >= 5: # Saturday or Sunday
        response = api_client.get(url + CORRECT_PARAMS)
        # Route could not be found because it's the weekend
        assert response.status_code == 400

    # Case 3.2: In bounds coordinates (For all profiles except concordia-shuttle during weekend)
    if not(profile=="concordia-shuttle" and today >= 5):
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