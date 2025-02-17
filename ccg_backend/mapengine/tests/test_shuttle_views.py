from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from ..models.shuttle import ShuttleStop, ShuttleSchedule
from datetime import datetime, time
from unittest.mock import patch

class ShuttleViewsTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.shuttle_stop = ShuttleStop.objects.create(name="SGW", latitude=45.4971, longitude=-73.5788)
        self.shuttle_schedule1 = ShuttleSchedule.objects.create(campus="SGW", day_of_week=0, time=time(14, 30))
        self.shuttle_schedule2 = ShuttleSchedule.objects.create(campus="SGW", day_of_week=0, time=time(15, 0))
        self.shuttle_schedule3 = ShuttleSchedule.objects.create(campus="SGW", day_of_week=0, time=time(15, 30))
        self.shuttle_schedule4 = ShuttleSchedule.objects.create(campus="SGW", day_of_week=0, time=time(16, 0))
        # mock datetime.now().time() to 14:00:00
        self.patcher = patch('mapengine.views.shuttle_views.datetime')
        self.mock_datetime = self.patcher.start()
        self.mock_datetime.now.return_value = datetime(2025, 2, 10, 14, 0, 0)  # Mocked to 14:00:00
        # mock datetime.today().weekday() to 1 (Tuesday)
        self.mock_datetime.today.return_value = datetime(2025, 2, 10)
        # mock datetime.combine() to return the same datetime object
        self.mock_datetime.combine.return_value = datetime(2025, 2, 10, 14, 30, 0)
    def tearDown(self):
        self.patcher.stop()

    def test_get_shuttle_stops(self):
        response = self.client.get(reverse('shuttle-stops'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['stops']), 1)
        self.assertEqual(response.json()['stops'][0]['name'], "SGW")

    def test_get_upcoming_sheduled_shuttle_missing_campus(self):
        response = self.client.get(reverse('upcoming-shuttle'))
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['error'], "Missing campus parameter")

    def test_get_upcoming_sheduled_shuttle_invalid_campus(self):
        response = self.client.get(reverse('upcoming-shuttle'), {'campus': 'INVALID'})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['error'], "Invalid campus name")

    def test_get_upcoming_sheduled_shuttle_valid_campus(self):
        response = self.client.get(reverse('upcoming-shuttle'), {'campus': 'SGW'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['upcoming_shuttles']), 3)
        self.assertEqual(response.json()['upcoming_shuttles'][0]['scheduled_time'], "14:30:00")

    def test_get_upcoming_sheduled_shuttle_on_weekend(self):
        self.mock_datetime.today.return_value = datetime(2025, 2, 9)
        response = self.client.get(reverse('upcoming-shuttle'), {'campus': 'SGW'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()['upcoming_shuttles']), 0)
