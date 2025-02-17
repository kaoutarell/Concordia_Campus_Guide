from django.http import JsonResponse
from rest_framework.decorators import api_view
from django.views.decorators.http import require_http_methods
from ..models.shuttle import ShuttleStop, ShuttleSchedule
from datetime import datetime

@api_view(['GET'])
@require_http_methods(['GET'])
def get_shuttle_stops(request):
    stops = ShuttleStop.objects.all()
    return JsonResponse({
        "stops": [{"name": stop.name, "latitude": stop.latitude, "longitude": stop.longitude} for stop in stops]
    })

@api_view(['GET'])
@require_http_methods(['GET'])
def get_upcoming_sheduled_shuttle(request):
    campus = request.GET.get('campus')

    if not campus:
        return JsonResponse({"error": "Missing campus parameter"}, status=400)
    campus = campus.upper()
    if not ShuttleStop.objects.filter(name=campus).first():
        return JsonResponse({"error": "Invalid campus name"}, status=400)

    day_of_week = datetime.today().weekday()
    current_time = datetime.now().time()

    schedule = ShuttleSchedule.objects.filter(campus=campus, day_of_week=day_of_week, time__gte=current_time).order_by('time')

    if len(schedule) > 3:
        schedule = schedule[:3]
    
    upcoming_shuttles = []
    for shuttle in schedule:
        departure_time = datetime.combine(datetime.now().date(), shuttle.time)
        time_to_departure = round((departure_time - datetime.now()).total_seconds() / 60)
        upcoming_shuttles.append({
            "scheduled_time": shuttle.time.strftime("%H:%M:%S"),
            "time_to_departure": time_to_departure
        })

    return JsonResponse({
        "upcoming_shuttles": upcoming_shuttles
    })
    
