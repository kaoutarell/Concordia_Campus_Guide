from django.http import JsonResponse
from rest_framework.decorators import api_view
from django.views.decorators.http import require_http_methods
from ..models.shuttle import ShuttleStop, ShuttleSchedule
from datetime import datetime
from django.db.models import F
from django.db.models.functions import Power
from pytz import timezone

tz = timezone('America/New_York')

@api_view(['GET'])
@require_http_methods(['GET'])
def get_shuttle_stops(_):
    stops = ShuttleStop.objects.all()
    return JsonResponse({
        "stops": [{"name": stop.name, "latitude": stop.latitude, "longitude": stop.longitude} for stop in stops]
    })

@api_view(['GET'])
@require_http_methods(['GET'])
def get_upcoming_sheduled_shuttle(request):
    # fix unit tests
    try:
        longitude = float(request.GET.get('long', 0.0))
        latitude = float(request.GET.get('lat', 0.0))
    except ValueError:
        longitude = None
        latitude = None

    if not longitude or not latitude:
        # default to SGW
        latitude = ShuttleStop.objects.get(name="SGW").latitude
        longitude = ShuttleStop.objects.get(name="SGW").longitude


    # find the closest shuttle stop
    closest_stop = ShuttleStop.objects.annotate(distance=Power(F('latitude') - latitude, 2) + Power(F('longitude') - longitude, 2)).order_by('distance').first()

    now = datetime.now(tz)
    day_of_week = now.weekday()
    current_time = now.time()

    # Get the next 5 upcoming shuttles from the closest stop
    schedule = (
        ShuttleSchedule.objects
        .filter(campus=closest_stop.name, day_of_week=day_of_week, time__gte=current_time)
        .order_by('time')[:5]
    )

    upcoming_shuttles = []
    for shuttle in schedule:
        departure_time = tz.localize(datetime.combine(now.date(), shuttle.time))
        time_to_departure = round((departure_time - now).total_seconds() / 60)
        upcoming_shuttles.append({
            "scheduled_time": shuttle.time.strftime("%H:%M"),
            "time_to_departure": time_to_departure
        })

    return JsonResponse({
        "shuttle_stop": {
            "name": closest_stop.name,
            "latitude": closest_stop.latitude,
            "longitude": closest_stop.longitude
        },
        "upcoming_shuttles": upcoming_shuttles
    })