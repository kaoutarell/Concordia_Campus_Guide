from django.test import TestCase
from django.urls import reverse
from pytz import timezone
from rest_framework.test import APIClient

from ..models.shuttle import ShuttleSchedule, ShuttleStop

from ..views.shuttle_views import get_sgw_coordinates

from unittest.mock import patch

from ..views.shuttle_views import get_closest_shuttle_stop, get_upcoming_shuttles

from datetime import datetime
import pytz


class ShuttleViewsTestCase(TestCase):
    tz = timezone("America/New_York")

    def setUp(self):
        self.client = APIClient()
        self.shuttle_stop = ShuttleStop.objects.create(
            name="SGW", latitude=45.4971, longitude=-73.5788
        )
        self.shuttle_schedule1 = ShuttleSchedule.objects.create(
            campus="SGW", day_of_week=0, time=time(14, 30)
        )
        self.shuttle_schedule2 = ShuttleSchedule.objects.create(
            campus="SGW", day_of_week=0, time=time(15, 0)
        )
        self.shuttle_schedule3 = ShuttleSchedule.objects.create(
            campus="SGW", day_of_week=0, time=time(15, 30)
        )
        self.shuttle_schedule4 = ShuttleSchedule.objects.create(
            campus="SGW", day_of_week=0, time=time(16, 0)
        )
        self.shuttle_schedule5 = ShuttleSchedule.objects.create(
            campus="SGW", day_of_week=0, time=time(16, 30)
        )
        self.shuttle_schedule6 = ShuttleSchedule.objects.create(
            campus="SGW", day_of_week=0, time=time(17, 0)
        )
        self.shuttle_schedule7 = ShuttleSchedule.objects.create(
            campus="SGW", day_of_week=0, time=time(17, 30)
        )
        self.shuttle_schedule8 = ShuttleSchedule.objects.create(
            campus="SGW", day_of_week=0, time=time(18, 0)
        )
        self.shuttle_schedule9 = ShuttleSchedule.objects.create(
            campus="SGW", day_of_week=0, time=time(18, 30)
        )
        # mock datetime.now().time() to 14:00:00
        self.patcher = patch("mapengine.views.shuttle_views.datetime")
        self.mock_datetime = self.patcher.start()
        self.mock_datetime.now.return_value = datetime(
            2025, 2, 10, 14, 0, tzinfo=self.tz
        )  # Mocked to 14:00:00
        # mock datetime.today().weekday() to 1 (Tuesday)
        self.mock_datetime.today.return_value = datetime(2025, 2, 10, tzinfo=self.tz)
        # mock datetime.combine() to return the same datetime object
        self.mock_datetime.combine.return_value = datetime(2025, 2, 10, 14, 30)

    def tearDown(self):
        self.patcher.stop()

    def test_get_shuttle_stops(self):
        response = self.client.get(reverse("shuttle-stops"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()["stops"]), 1)
        self.assertEqual(response.json()["stops"][0]["name"], "SGW")

    def test_get_upcoming_sheduled_shuttle_missing_coord(self):
        response = self.client.get(reverse("upcoming-shuttle"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()["upcoming_shuttles"]), 5)
        self.assertEqual(
            response.json()["upcoming_shuttles"][0]["scheduled_time"], "14:30"
        )

    def test_get_upcoming_sheduled_shuttle_sgw(self):
        response = self.client.get(
            reverse("upcoming-shuttle"), {"long": -73.579, "lat": 45.4973}
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()["upcoming_shuttles"]), 5)
        self.assertEqual(
            response.json()["upcoming_shuttles"][0]["scheduled_time"], "14:30"
        )

    def test_get_upcoming_sheduled_shuttle_sgw_at_end_of_day(self):
        # Change the mock date to February 9, 2025 (Sunday)
        self.mock_datetime.now.return_value = datetime(
            2025, 2, 10, 17, 45, tzinfo=self.tz
        )
        response = self.client.get(
            reverse("upcoming-shuttle"), {"long": -73.579, "lat": 45.4973}
        )
        self.assertEqual(response.status_code, 200)
        # print(response.json())
        self.assertEqual(len(response.json()["upcoming_shuttles"]), 2)

    def test_get_upcoming_sheduled_shuttle_sgw_on_weekend(self):
        # Change the mock date to February 9, 2025 (Sunday)
        self.mock_datetime.now.return_value = datetime(
            2025, 2, 9, 14, 0, 0, tzinfo=self.tz
        )
        self.mock_datetime.today.return_value = datetime(2025, 2, 9)
        response = self.client.get(
            reverse("upcoming-shuttle"), {"long": -73.579, "lat": 45.4973}
        )
        self.assertEqual(response.status_code, 200)
        print(response.json())
        self.assertEqual(len(response.json()["upcoming_shuttles"]), 0)

    def test_get_sgw_coordinates_exists(self):
        """Test retrieving SGW coordinates when SGW stop exists."""
        latitude, longitude = get_sgw_coordinates()
        self.assertEqual(latitude, 45.4971)
        self.assertEqual(longitude, -73.5788)

    def test_get_sgw_coordinates_missing(self):
        """Test behavior when SGW shuttle stop is missing."""
        ShuttleStop.objects.filter(name="SGW").delete()  # Remove SGW from DB
        latitude, longitude = get_sgw_coordinates()
        self.assertIsNone(latitude)
        self.assertIsNone(longitude)

    def test_get_closest_shuttle_stop(self):
        """Test finding the closest shuttle stop."""
        closest_stop = get_closest_shuttle_stop(-73.579, 45.4973)
        self.assertIsNotNone(closest_stop)
        self.assertEqual(closest_stop.name, "SGW")  # SGW should be closest

    def test_get_closest_shuttle_stop_no_stops(self):
        """Test behavior when no shuttle stops exist."""
        ShuttleStop.objects.all().delete()  # Remove all stops
        closest_stop = get_closest_shuttle_stop(-73.579, 45.4973)
        self.assertIsNone(closest_stop)  # Should return None

    def test_get_upcoming_shuttles(self):
        """Test retrieving the next 5 upcoming shuttles."""
        upcoming_shuttles = get_upcoming_shuttles("SGW")

        self.assertEqual(len(upcoming_shuttles), 5)
        self.assertEqual(upcoming_shuttles[0]["scheduled_time"], "14:30")
        self.assertEqual(upcoming_shuttles[1]["scheduled_time"], "15:00")

    def test_get_upcoming_shuttles_no_schedules(self):
        """Test when no upcoming schedules exist."""
        ShuttleSchedule.objects.all().delete()  # Remove all schedules
        upcoming_shuttles = get_upcoming_shuttles("SGW")
        self.assertEqual(len(upcoming_shuttles), 0)  # Should return an empty list
