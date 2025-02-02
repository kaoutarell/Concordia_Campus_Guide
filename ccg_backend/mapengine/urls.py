from django.urls import path
from mapengine.views.building_views import get_buildings_by_campus
from mapengine.views.route_views import route_list_create

urlpatterns = [
    path('buildings-by-campus/', get_buildings_by_campus, name='buildings-by-campus'),
    path('routes/', route_list_create, name='route-list'),
]