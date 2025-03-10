from unittest.mock import MagicMock, patch

import pytest
from django.urls import reverse
from rest_framework.test import APIClient

from ..models.department import Department


@pytest.fixture
def api_client():
    return APIClient()


def test_get_departments_by_building(api_client):
    url = reverse("departments-by-building")  # Ensure this matches your URL name
    response = api_client.get(url)
    assert response.status_code == 400
    assert response.data == {"error": "Missing building_id parameter"}
