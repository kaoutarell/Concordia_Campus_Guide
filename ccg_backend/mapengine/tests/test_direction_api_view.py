import pytest
from django.contrib.gis.geos import Point
from django.urls import reverse
from rest_framework.test import APIClient

from mapengine.models.building import Building
from mapengine.models.shuttle import ShuttleStop

# Hall Building
MOCK_H_BUILDING = "-73.579,45.4973"
# Vanier Library
MOCK_VL_BUILDING = "-73.6384110982496,45.45906620855598"
# EV Building
MOCK_EV_BUILDING = "-73.5783,45.4955"

# Hall Building to EV Building
SAME_CAMPUS_PARAMS = f"?start={MOCK_H_BUILDING}&end={MOCK_EV_BUILDING}"
# Hall Building to Vanier Library
CORRECT_PARAMS = f"?start={MOCK_H_BUILDING}&end={MOCK_VL_BUILDING}"
INVALID_PARAMS = "?start=0,0&end=0,0"


@pytest.fixture
def api_client():
    return APIClient()


def test_get_profiles(api_client):
    url = reverse("profiles")
    response = api_client.get(url)
    assert response.status_code == 200
    assert response.json() == {
        "profiles": [
            "foot-walking",
            "cycling-regular",
            "driving-car",
            "wheelchair",
            "public-transport",
            "concordia-shuttle",
        ]
    }


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


@pytest.mark.django_db
def test_concordia_shuttle_directions(api_client):
    # Setup mock data
    Building.objects.create(
        name="Hall Building", location=Point(-73.579, 45.4973), campus="SGW"
    )
    Building.objects.create(
        name="Vanier Library",
        location=Point(-73.6384110982496, 45.45906620855598),
        campus="LOY",
    )

    ShuttleStop.objects.create(
        name="SGW", latitude=45.497129019513835, longitude=-73.57852460612132
    )
    ShuttleStop.objects.create(
        name="LOY", latitude=45.45841608855384, longitude=-73.63828201677715
    )

    # Test the API
    url = reverse("concordia-shuttle")

    # Case 1: Missing start or end parameter
    response = api_client.get(url)
    assert response.status_code == 400
    assert response.json() == {"error": "Missing start or end parameter"}

    # Case 2: Invalid coordinates
    response = api_client.get(url + INVALID_PARAMS)
    print(response.json())
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
    assert set(json["legs"].keys()) == {
        "walk_to_stop",
        "shuttle_ride",
        "walk_from_stop",
    }

    # Check each leg
    for leg_name, expected_profile in [
        ("walk_to_stop", "foot-walking"),
        ("shuttle_ride", "driving-car"),
        ("walk_from_stop", "foot-walking"),
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


@pytest.mark.django_db
def test_concordia_shuttle_same_campus(api_client):
    # Mock data
    Building.objects.create(
        name="Hall Building", location=Point(-73.579, 45.4973), campus="SGW"
    )
    Building.objects.create(
        name="Vanier Library",
        location=Point(-73.6384110982496, 45.45906620855598),
        campus="LOY",
    )

    # Test the API
    url = reverse("concordia-shuttle")
    response = api_client.get(url + SAME_CAMPUS_PARAMS)
    print(response.json())
    assert response.status_code == 200
    json = response.json()
    # Should fall back to walking directions
    assert "profile" in json and json["profile"] == "foot-walking"
    assert "steps" in json and isinstance(json["steps"], list)
