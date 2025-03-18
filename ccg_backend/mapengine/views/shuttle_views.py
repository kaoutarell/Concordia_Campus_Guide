from datetime import datetime
from zoneinfo import ZoneInfo

from django.db.models import F
from django.db.models.functions import Power
from django.http import JsonResponse
from django.utils.timezone import make_aware
from django.views.decorators.http import require_http_methods
from rest_framework.decorators import api_view

from ..models.shuttle import ShuttleSchedule, ShuttleStop

tz = ZoneInfo("America/New_York")


@api_view(["GET"])
@require_http_methods(["GET"])
def get_shuttle_stops(_):
    stops = ShuttleStop.objects.all()
    return JsonResponse(
        {
            "stops": [
                {
                    "name": stop.name,
                    "latitude": stop.latitude,
                    "longitude": stop.longitude,
                }
                for stop in stops
            ]
        }
    )


@api_view(["GET"])
@require_http_methods(["GET"])
def get_upcoming_sheduled_shuttle(request):
    # fix unit tests
    try:
        longitude = float(request.GET.get("long", 0.0))
        latitude = float(request.GET.get("lat", 0.0))
    except ValueError:
        longitude = None
        latitude = None

    if longitude is None or latitude is None:
        longitude, latitude = get_sgw_coordinates()

    # find the closest shuttle stop
    closest_stop = get_closest_shuttle_stop(longitude, latitude)

    upcoming_shuttles = get_upcoming_shuttles(closest_stop.name)


    return JsonResponse(
        {
            "shuttle_stop": {
                "name": closest_stop.name,
                "latitude": closest_stop.latitude,
                "longitude": closest_stop.longitude,
            },
            "upcoming_shuttles": upcoming_shuttles,
        }
    )

def get_sgw_coordinates():
    """Retrieves SGW coordinates from the database (only queried once)."""
    sgw_stop = ShuttleStop.objects.filter(name="SGW").values_list("latitude", "longitude").first()
    return sgw_stop if sgw_stop else (None, None)  # Prevents crashes if SGW is missing

def get_closest_shuttle_stop(longitude, latitude):
    """Finds the closest shuttle stop based on given coordinates."""
    return ShuttleStop.objects.annotate(
        distance=Power(F("latitude") - latitude, 2) + Power(F("longitude") - longitude, 2)
    ).order_by("distance").first()

def get_upcoming_shuttles(stop_name):
    """Retrieves the next 5 upcoming shuttles from the given stop."""
    now = datetime.now(tz)
    day_of_week = now.weekday()
    current_time = now.time()

    # Get the next 5 upcoming shuttles from the closest stop
    schedule = ShuttleSchedule.objects.filter(
        campus=stop_name, day_of_week=day_of_week, time__gte=current_time
    ).order_by("time")[:5]

    upcoming_shuttles = []
    for shuttle in schedule:
        departure_time = make_aware(
            datetime.combine(now.date(), shuttle.time), timezone=tz
        )
        time_to_departure = round((departure_time - now).total_seconds() / 60)
        upcoming_shuttles.append(
            {
                "scheduled_time": shuttle.time.strftime("%H:%M"),
                "time_to_departure": time_to_departure,
            }
        )

    return upcoming_shuttles