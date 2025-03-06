from django.http import JsonResponse
from rest_framework.decorators import api_view
from ..utils.indoor_direction_api_utils import select_map, get_node_sequence, get_path_coordinates, convert_coords_to_output

@api_view(['GET'])
def get_indoor_directions(request):
    start=request.GET.get('start')
    destination=request.GET.get('destination')
    map_data=select_map(request)
    sequence=get_node_sequence(map_data, start, destination)
    coords=get_path_coordinates(map_data, sequence)
    path = {"path_data": convert_coords_to_output(coords)}
    print(path)
    print(coords)
    return JsonResponse(path)