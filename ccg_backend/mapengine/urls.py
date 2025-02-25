from django.urls import path

from mapengine.views.direction_api_views import foot_walking_directions, cycling_regular_directions, driving_car_directions, \
    wheelchair_directions, public_transport_directions, shuttle_bus_directions, get_profiles
from mapengine.views.building_views import get_buildings_by_campus, get_buildings
from mapengine.views.route_views import route_list_create
from mapengine.views.shuttle_views import get_shuttle_stops, get_upcoming_sheduled_shuttle
from mapengine.views.department_views import get_all_departments, get_departments_by_building
from mapengine.views.service_views import get_services_by_building, get_all_services

urlpatterns = [
    path('buildings-by-campus/', get_buildings_by_campus, name='buildings-by-campus'),
    path('buildings', get_buildings, name='buildings'),
    path('routes/', route_list_create, name='route-list'),
    path('directions/foot-walking', foot_walking_directions, name='foot-walking'),
    path('directions/cycling-regular', cycling_regular_directions, name='cycling-regular'),
    path('directions/driving-car', driving_car_directions, name='driving-car'),
    path('directions/wheelchair', wheelchair_directions, name='wheelchair'),
    path('directions/public-transport', public_transport_directions, name='public-transport'),
    path('directions/concordia-shuttle', shuttle_bus_directions, name='concordia-shuttle'),
    path('directions/', get_profiles, name='profiles'),
    path('shuttle_stops/', get_shuttle_stops, name='shuttle-stops'),
    path('upcoming_shuttle/', get_upcoming_sheduled_shuttle, name='upcoming-shuttle'),
    path('departments/', get_all_departments, name='departments'),
    path('departments-by-building/', get_departments_by_building, name='departments-by-building'),
    path('services-by-building/', get_services_by_building, name='services-by-building'),
    path('services/', get_all_services, name='services')
]