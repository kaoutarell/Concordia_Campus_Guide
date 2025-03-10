from unittest.mock import MagicMock, patch

import pytest
from django.urls import reverse
from rest_framework.test import APIClient

from ..models.building import Building


@pytest.fixture
def api_client():
    return APIClient()


def test_get_buildings_by_campus(api_client):
    url = reverse("buildings-by-campus")

    # Case 1: No campus parameter
    response = api_client.get(url)
    assert response.status_code == 400
    assert response.data == {"error": "Missing campus parameter"}

    # Case 2: Mock database call
    with patch("mapengine.views.building_views.Building.objects.filter") as mock_filter:
        mock_building_1 = MagicMock(id=1, name="Building A", campus="Downtown")
        mock_building_2 = MagicMock(id=2, name="Building B", campus="Downtown")
        mock_filter.return_value = [mock_building_1, mock_building_2]

        response = api_client.get(url, {"campus": "Downtown"})
        assert response.status_code == 200
        assert isinstance(response.data, list)
        assert len(response.data) == 2
