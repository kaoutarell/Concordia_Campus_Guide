import pytest
from django.contrib.gis.geos import Point
from django.urls import reverse
from rest_framework.test import APIClient

from mapengine.models.building import Building
from mapengine.models.shuttle import ShuttleStop
from mapengine.views.direction_api_views import (parse_coordinates,
 find_nearest_building,
 get_shuttle_stops,
 build_combined_route)

from mapengine.exceptions.exceptions import (
    InvalidCoordinatesError,
    BuildingNotFoundError,
    ShuttleStopNotFoundError,
)

from unittest.mock import Mock
from unittest.mock import patch
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

    # Test the API
    url = reverse("concordia-shuttle")
    response = api_client.get(url + SAME_CAMPUS_PARAMS)
    print(response.json())
    assert response.status_code == 200
    json = response.json()
    # Should fall back to walking directions
    assert "profile" in json and json["profile"] == "foot-walking"
    assert "steps" in json and isinstance(json["steps"], list)

def test_parse_coordinates_valid():
    """Test valid coordinate parsing."""
    start = "-73.579,45.4973"
    end = "-73.6384,45.4590"
    result = parse_coordinates(start, end)
    assert result == ((-73.579, 45.4973), (-73.6384, 45.4590))

def test_parse_coordinates_missing_parameters():
    """Test missing start or end coordinates."""
    with pytest.raises(InvalidCoordinatesError, match="Missing start or end parameter"):
        parse_coordinates(None, "-73.6384,45.4590")
    with pytest.raises(InvalidCoordinatesError, match="Missing start or end parameter"):
        parse_coordinates("-73.579,45.4973", None)

def test_parse_coordinates_invalid_format():
    """Test invalid coordinate formats."""
    with pytest.raises(InvalidCoordinatesError, match="Invalid coordinate format. Use 'lon,lat'."):
        parse_coordinates("invalid", "-73.6384,45.4590")

    with pytest.raises(InvalidCoordinatesError, match="Invalid coordinate format. Use 'lon,lat'."):
        parse_coordinates("-73.579,45.4973", "invalid")

@pytest.mark.django_db
def test_find_nearest_building():
    """Test finding the nearest building."""
    building = Building.objects.create(name="Test Building", location=Point(-73.579, 45.4973), campus="SGW")
    point = Point(-73.579, 45.4973, srid=4326)
    result = find_nearest_building(point)
    assert result == building

@pytest.mark.django_db
def test_find_nearest_building_not_found():
    """Test when no building is found near the given point."""
    point = Point(-73.000, 45.000, srid=4326)
    with pytest.raises(BuildingNotFoundError, match="No nearby building found for the given location."):
        find_nearest_building(point)

@pytest.mark.django_db
def test_get_shuttle_stops():
    """Test retrieving valid shuttle stops."""
    sgw_stop = ShuttleStop.objects.create(name="SGW", latitude=45.4971, longitude=-73.5785)
    loy_stop = ShuttleStop.objects.create(name="LOY", latitude=45.4590, longitude=-73.6384)
    result = get_shuttle_stops("SGW", "LOY")
    assert result == (sgw_stop, loy_stop)

@pytest.mark.django_db
def test_get_shuttle_stops_not_found():
    """Test when a shuttle stop does not exist."""
    with pytest.raises(ShuttleStopNotFoundError, match="Shuttle stop not found for one or both campuses."):
        get_shuttle_stops("SGW", "LOY")

def test_build_combined_route():
    """Test constructing the final combined route."""
    mock_origin_building = Mock()
    mock_origin_building.building_code = "H"

    mock_destination_building = Mock()
    mock_destination_building.building_code = "VL"

    route_legs = {
        "walk_to_stop": {"total_distance": 100, "total_duration": 10, "steps": [{"instruction": "Walk forward"}]},
        "shuttle_ride": {"total_distance": 500, "total_duration": 30, "steps": [{"instruction": "Board shuttle"}]},
        "walk_from_stop": {"total_distance": 200, "total_duration": 20, "steps": [{"instruction": "Walk to building"}]},
    }
    result = build_combined_route(route_legs, mock_origin_building, mock_destination_building, "SGW", "LOY")

    assert result["total_distance"] == 800
    assert result["total_duration"] == 60
    assert result["origin_building"] == "H"
    assert result["destination_building"] == "VL"
    assert result["origin_campus"] == "SGW"
    assert result["destination_campus"] == "LOY"
    assert isinstance(result["bbox"], list)  # Ensures bbox is correctly computed


@pytest.mark.django_db
def test_multi_modal_shuttle_directions_missing_params(api_client):
    """Test API with missing start or end parameters."""
    url = reverse("concordia-shuttle")

    response = api_client.get(url)  # No parameters
    assert response.status_code == 400
    assert response.json() == {"error": "Missing start or end parameter"}

#
@pytest.mark.django_db
def test_multi_modal_shuttle_directions_invalid_format(api_client):
    """Test API with incorrectly formatted coordinates."""
    url = reverse("concordia-shuttle")
    response = api_client.get(url, {"start": "invalid", "end": "45.4973,-73.579"})

    assert response.status_code == 400
    assert response.json() == {"error": "Invalid coordinate format. Use 'lon,lat'."}

#
@pytest.mark.django_db
def test_multi_modal_shuttle_directions_no_nearby_building(api_client):
    """Test API when no nearby buildings exist."""
    url = reverse("concordia-shuttle")
    response = api_client.get(url, {"start": "-73.000,45.000", "end": "-73.500,45.500"})

    assert response.status_code == 404
    assert "No nearby building found" in response.json()["error"]
#
#
@pytest.mark.django_db
def test_multi_modal_shuttle_directions_shuttle_stops_not_found(api_client):
    """Test API when no shuttle stops exist for the campuses."""
    # Create buildings but no shuttle stops
    Building.objects.create(name="Hall Building", location=Point(-73.579, 45.4973), campus="SGW")
    Building.objects.create(name="Vanier Library", location=Point(-73.638, 45.459), campus="LOY")

    url = reverse("concordia-shuttle")
    response = api_client.get(url, {"start": "-73.579,45.4973", "end": "-73.638,45.459"})

    assert response.status_code == 404
    assert "Shuttle stop not found" in response.json()["error"]


