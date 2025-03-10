from unittest.mock import MagicMock, patch

import pytest
from django.urls import reverse
from rest_framework.test import APIClient

from ..models.service import Service


@pytest.fixture
def api_client():
    return APIClient()


def test_get_services_by_building(api_client):
    url = reverse("services-by-building")  # Ensure this matches the name in `urls.py`

    # Case 1: No building_id parameter
    response = api_client.get(url)
    assert response.status_code == 400
    assert response.data == {"error": "Missing building_id parameter"}
