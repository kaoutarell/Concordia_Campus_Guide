from .building_views import get_buildings_by_campus
from .route_views import route_list_create
from .direction_api_views import foot_walking_directions, cycling_regular_directions, driving_car_directions, \
    wheelchair_directions, public_transport_directions, shuttle_bus_directions
from .shuttle_views import get_shuttle_stops, get_upcoming_sheduled_shuttle

from .department_views import get_all_departments, get_departments_by_building
from .service_views import get_services_by_building, get_all_services

from .point_of_interest_views import get_points_of_interest, get_all_categories

