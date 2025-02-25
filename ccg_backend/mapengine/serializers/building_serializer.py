
from rest_framework import serializers
from django.contrib.gis.geos import Point
from ..models.building import Building
class BuildingSerializer(serializers.ModelSerializer):
    location = serializers.SerializerMethodField()

    class Meta:
        model = Building
        fields = ['id', 'name', 'building_code', 'location', 'civic_address', 'campus',
                  'parking_lot', 'accessibility', 'atm', 'bikerack', 'infokiosk', 'image'
                 ]

    def get_location(self, obj):
        """Return location as a dictionary with latitude and longitude."""
        if obj.location and isinstance(obj.location, Point):
            return {"latitude": obj.location.y, "longitude": obj.location.x}
        return None  # Handle missing location gracefully