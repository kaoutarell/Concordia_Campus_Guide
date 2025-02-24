from rest_framework.response import Response
from rest_framework import status
from ..models import PointOfInterest
from ..serializers import PointOfInterestSerializer
from rest_framework.decorators import api_view
from django.views.decorators.http import require_http_methods


@api_view(['GET'])
@require_http_methods(['GET'])
def get_points_of_interest(request):
    category = request.query_params.get('category')
    campus = request.query_params.get('campus')
    if category and campus:
        points_of_interest = PointOfInterest.objects.filter(category=category, campus=campus.upper())
    elif category:
        points_of_interest = PointOfInterest.objects.filter(category=category)
    elif campus:
        points_of_interest = PointOfInterest.objects.filter(campus=campus.upper())
    else:
        points_of_interest = PointOfInterest.objects.all()

    serializer = PointOfInterestSerializer(points_of_interest, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@require_http_methods(['GET'])
def get_all_categories(_):
    categories = PointOfInterest.objects.values('category').distinct()
    # format it to a list of strings and sorted alphabetically
    categories = sorted([category['category'] for category in categories])
    return Response(categories, status=status.HTTP_200_OK)



