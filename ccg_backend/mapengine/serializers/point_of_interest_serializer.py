from django.contrib.gis.geos import Point
from rest_framework import serializers

from ..models.point_of_interest import PointOfInterest


class PointOfInterestSerializer(serializers.ModelSerializer):
    location = serializers.SerializerMethodField()

    class Meta:
        model = PointOfInterest
        fields = ["id", "name", "location", "category", "campus", "civic_address"]

    def get_location(self, obj):
        """Return location as a dictionary with latitude and longitude."""
        if obj.location and isinstance(obj.location, Point):
            return {"latitude": obj.location.y, "longitude": obj.location.x}
        return None  # Handle missing location gracefully
