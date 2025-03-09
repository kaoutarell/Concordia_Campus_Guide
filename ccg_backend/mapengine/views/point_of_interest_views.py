from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.geos import Point
from django.views.decorators.http import require_http_methods
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from ..models import PointOfInterest
from ..serializers import PointOfInterestSerializer


@api_view(["GET"])
@require_http_methods(["GET"])
def get_points_of_interest(request):
    category = request.query_params.get("category")
    campus = request.query_params.get("campus")
    longitude = request.query_params.get("longitude")
    latitude = request.query_params.get("latitude")
    # if the longitude and latitude are provided, return the closest point of interest

    if category and campus:
        points_of_interest = PointOfInterest.objects.filter(
            category=category, campus=campus.upper()
        )
    elif category:
        points_of_interest = PointOfInterest.objects.filter(category=category)
    elif campus:
        points_of_interest = PointOfInterest.objects.filter(campus=campus.upper())
    else:
        points_of_interest = PointOfInterest.objects.all()
    # if the longitude and latitude are provided, return the closest point of interest
    if longitude and latitude:
        longitude = float(longitude)
        latitude = float(latitude)
        user_location = Point(
            longitude, latitude, srid=4326
        )  # Ensure SRID matches your DB
        points_of_interest = points_of_interest.annotate(
            distance=Distance("location", user_location)
        ).order_by("distance")

    serializer = PointOfInterestSerializer(points_of_interest, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET"])
@require_http_methods(["GET"])
def get_all_categories(_):
    categories = PointOfInterest.objects.values("category").distinct()
    # format it to a list of strings and sorted alphabetically
    categories = sorted([category["category"] for category in categories])
    return Response(categories, status=status.HTTP_200_OK)
