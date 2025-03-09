from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from ..models import PointOfInterest


class PointOfInterestViewsTests(APITestCase):

    def setUp(self):
        # Location is not a real location, just a placeholder
        self.poi1 = PointOfInterest.objects.create(
            name="Restaurant1",
            category="restaurant",
            campus="SGW",
            location="POINT(-73.5788 45.4971)",
        )
        self.poi2 = PointOfInterest.objects.create(
            name="Cafe1",
            category="cafe",
            campus="LOY",
            location="POINT(-73.579 45.4973)",
        )
        self.poi3 = PointOfInterest.objects.create(
            name="Cafe2",
            category="cafe",
            campus="SGW",
            location="POINT(-73.5788 45.4971)",
        )
        self.poi4 = PointOfInterest.objects.create(
            name="FastFood1",
            category="fast_food",
            campus="LOY",
            location="POINT(-73.579 45.4973)",
        )

    def test_get_points_of_interest(self):
        url = reverse("points-of-interest")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 4)

    def test_get_points_of_interest_by_category(self):
        url = reverse("points-of-interest")
        response = self.client.get(url, {"category": "cafe"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]["category"], "cafe")
        self.assertEqual(response.data[1]["category"], "cafe")

    def test_get_points_of_interest_by_campus(self):
        url = reverse("points-of-interest")
        response = self.client.get(url, {"campus": "SGW"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]["campus"], "SGW")
        self.assertEqual(response.data[1]["campus"], "SGW")

    def test_get_points_of_interest_by_category_and_campus(self):
        url = reverse("points-of-interest")
        response = self.client.get(url, {"category": "cafe", "campus": "SGW"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["category"], "cafe")
        self.assertEqual(response.data[0]["campus"], "SGW")

    def test_get_all_categories(self):
        url = reverse("poi-categories")
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, ["cafe", "fast_food", "restaurant"])
