from django.urls import path

from mapengine.views.building_views import get_buildings, get_buildings_by_campus
from mapengine.views.department_views import (
    get_all_departments,
    get_departments_by_building,
)
from mapengine.views.direction_api_views import (
    cycling_regular_directions,
    driving_car_directions,
    foot_walking_directions,
    get_profiles,
    public_transport_directions,
    shuttle_bus_directions,
    wheelchair_directions,
)
from mapengine.views.indoor_directions import get_indoor_directions
from mapengine.views.point_of_interest_views import (
    get_all_categories,
    get_points_of_interest,
)
from mapengine.views.route_views import route_list_create
from mapengine.views.service_views import get_all_services, get_services_by_building
from mapengine.views.shuttle_views import (
    get_shuttle_stops,
    get_upcoming_sheduled_shuttle,
)

urlpatterns = [
    path("buildings-by-campus/", get_buildings_by_campus, name="buildings-by-campus"),
    path("buildings", get_buildings, name="buildings"),
    path("routes/", route_list_create, name="route-list"),
    path("directions/foot-walking", foot_walking_directions, name="foot-walking"),
    path(
        "directions/cycling-regular", cycling_regular_directions, name="cycling-regular"
    ),
    path("directions/driving-car", driving_car_directions, name="driving-car"),
    path("directions/wheelchair", wheelchair_directions, name="wheelchair"),
    path(
        "directions/public-transport",
        public_transport_directions,
        name="public-transport",
    ),
    path(
        "directions/concordia-shuttle", shuttle_bus_directions, name="concordia-shuttle"
    ),
    path("directions/", get_profiles, name="profiles"),
    path("shuttle_stops/", get_shuttle_stops, name="shuttle-stops"),
    path("upcoming_shuttle/", get_upcoming_sheduled_shuttle, name="upcoming-shuttle"),
    path("directions/indoor", get_indoor_directions, name="indoor"),
    path("departments/", get_all_departments, name="departments"),
    path(
        "departments-by-building/",
        get_departments_by_building,
        name="departments-by-building",
    ),
    path(
        "services-by-building/", get_services_by_building, name="services-by-building"
    ),
    path("services/", get_all_services, name="services"),
    path("poi/", get_points_of_interest, name="points-of-interest"),
    path("poi-categories/", get_all_categories, name="poi-categories"),
]
