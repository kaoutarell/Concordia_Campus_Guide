from django.urls import path

from mapengine.views.directions_api_view import foot_walking_directions, cycling_regular_directions, driving_car_directions, \
                                                wheelchair_directions, public_transport_directions, shuttle_bus_directions
from mapengine.views.building_views import get_buildings_by_campus, get_buildings
from mapengine.views.route_views import route_list_create

urlpatterns = [
    path('buildings-by-campus/', get_buildings_by_campus, name='buildings-by-campus'),
    path('buildings', get_buildings, name='buildings'),
    path('routes/', route_list_create, name='route-list'),
    path('directions/foot-walking', foot_walking_directions, name='foot-walking'),
    path('directions/cycling-regular', cycling_regular_directions, name='cycling-regular'),
    path('directions/driving-car', driving_car_directions, name='driving-car'),
    path('directions/wheelchair', wheelchair_directions, name='wheelchair'),
    path('directions/public-transport', public_transport_directions, name='public-transport'),
    path('directions/shuttle-bus', shuttle_bus_directions, name='shuttle-bus'),
]