from .building_views import get_buildings_by_campus
from .department_views import get_all_departments, get_departments_by_building
from .direction_api_views import (
    cycling_regular_directions,
    driving_car_directions,
    foot_walking_directions,
    public_transport_directions,
    shuttle_bus_directions,
    wheelchair_directions,
)
from .point_of_interest_views import get_all_categories, get_points_of_interest
from .route_views import route_list_create
from .service_views import get_all_services, get_services_by_building
from .shuttle_views import get_shuttle_stops, get_upcoming_sheduled_shuttle
