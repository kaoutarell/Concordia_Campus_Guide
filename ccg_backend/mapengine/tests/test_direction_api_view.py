import pytest
from django.contrib.gis.geos import Point
from django.urls import reverse
from rest_framework.test import APIClient
from unittest.mock import Mock, patch

from mapengine.models.building import Building
from mapengine.models.shuttle import ShuttleStop
from mapengine.views.direction_api_views import (
    parse_coordinates,
    find_nearest_building,
    get_shuttle_stops,
    build_combined_route,
)
from mapengine.exceptions.exceptions import (
    InvalidCoordinatesError,
    BuildingNotFoundError,
    ShuttleStopNotFoundError,
)

# Mock Coordinates
MOCK_H_BUILDING = "-73.579,45.4973"  # Hall Building
MOCK_VL_BUILDING = "-73.6384110982496,45.45906620855598"  # Vanier Library
MOCK_EV_BUILDING = "-73.5783,45.4955"  # EV Building

SAME_CAMPUS_PARAMS = f"?start={MOCK_H_BUILDING}&end={MOCK_EV_BUILDING}"
CORRECT_PARAMS = f"?start={MOCK_H_BUILDING}&end={MOCK_VL_BUILDING}"
INVALID_PARAMS = "?start=0,0&end=0,0"


@pytest.fixture
def api_client():
    """Fixture to provide API client."""
    return APIClient()


@pytest.fixture
def setup_test_data():
    """Fixture to create test buildings and shuttle stops before tests."""

    Building.objects.create(name="Hall Building", location=Point(-73.579, 45.4973), campus="SGW")
    Building.objects.create(name="Vanier Library", location=Point(-73.638, 45.459), campus="LOY")

    ShuttleStop.objects.create(name="SGW", latitude=45.4971, longitude=-73.5785)
    ShuttleStop.objects.create(name="LOY", latitude=45.4590, longitude=-73.6384)


@pytest.mark.django_db
def test_get_profiles(api_client):
    """Test retrieving available route profiles."""
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


@pytest.mark.django_db
@pytest.mark.parametrize("profile", [
    "foot-walking",
    "cycling-regular",
    "driving-car",
    "wheelchair",
    "public-transport",
])
def test_directions(api_client, setup_test_data, profile):
    """Test different travel modes with valid input."""

    print("DEBUG: Buildings in DB ->", list(Building.objects.values()))

    print("DEBUG: Shuttle Stops in DB ->", list(ShuttleStop.objects.values()))

    check_directions(api_client, profile)


def check_directions(api_client, profile):
    """Helper function to validate direction API responses."""

    # Case 1: Missing start or end parameter
    url = reverse(profile)
    response = api_client.get(url)
    assert response.status_code == 400
    assert response.json() == {"error": "Missing start or end parameter"}

    # Case 2: Out of bounds coordinates
    response = api_client.get(url + INVALID_PARAMS)
    assert response.status_code == 400

    # Case 3: Valid coordinates (except weekends for Concordia Shuttle)
    from datetime import datetime
    today = datetime.today().weekday()

    if not (profile == "concordia-shuttle" and today >= 5):
        response = api_client.get(url + CORRECT_PARAMS)
        assert response.status_code == 200


@pytest.mark.django_db
@pytest.mark.parametrize("start, end, expected", [
    ("-73.579,45.4973", "-73.6384,45.4590", ((-73.579, 45.4973), (-73.6384, 45.4590))),
])
def test_parse_coordinates_valid(start, end, expected):
    """Test valid coordinate parsing."""
    assert parse_coordinates(start, end) == expected


@pytest.mark.django_db
@pytest.mark.parametrize("start, end, expected_exception, expected_message", [
    (None, "-73.6384,45.4590", InvalidCoordinatesError, "Missing start or end parameter"),
    ("-73.579,45.4973", None, InvalidCoordinatesError, "Missing start or end parameter"),
])
def test_parse_coordinates_invalid(start, end, expected_exception, expected_message):
    """Test invalid coordinate formats."""
    with pytest.raises(expected_exception, match=expected_message):
        parse_coordinates(start, end)


@pytest.mark.django_db
def test_find_nearest_building():
    """Test finding the nearest building."""
    building = Building.objects.create(name="Test Building", location=Point(-73.579, 45.4973), campus="SGW")
    point = Point(-73.579, 45.4973, srid=4326)
    assert find_nearest_building(point) == building


@pytest.mark.django_db
def test_get_shuttle_stops():
    """Test retrieving valid shuttle stops."""
    sgw_stop = ShuttleStop.objects.create(name="SGW", latitude=45.4971, longitude=-73.5785)
    loy_stop = ShuttleStop.objects.create(name="LOY", latitude=45.4590, longitude=-73.6384)
    assert get_shuttle_stops("SGW", "LOY") == (sgw_stop, loy_stop)


@pytest.mark.django_db
def test_build_combined_route():
    """Test constructing the final combined route."""
    mock_origin_building = Mock(building_code="H")
    mock_destination_building = Mock(building_code="VL")

    route_legs = {
        "walk_to_stop": {"total_distance": 100, "total_duration": 10},
        "shuttle_ride": {"total_distance": 500, "total_duration": 30},
        "walk_from_stop": {"total_distance": 200, "total_duration": 20},
    }

    result = build_combined_route(route_legs, mock_origin_building, mock_destination_building, "SGW", "LOY")
    assert result["total_distance"] == 800
    assert result["total_duration"] == 60
    assert result["origin_building"] == "H"
    assert result["destination_building"] == "VL"
    assert result["origin_campus"] == "SGW"
    assert result["destination_campus"] == "LOY"


@pytest.mark.django_db
@patch("mapengine.views.direction_api_views.find_nearest_building", return_value=Mock(campus="SGW"))
def test_directions_with_mock(mock_find_nearest_building, api_client):
    """Test API with mocked nearest building to prevent 404 failures."""

    url = reverse("foot-walking")
    response = api_client.get(url, {"start": "-73.579,45.4973", "end": "-73.638,45.459"})

    assert response.status_code == 200
