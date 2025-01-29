from rest_framework import serializers
from django.contrib.gis.geos import Point, LineString
from .models import Building, ShuttleStop, Route

class BuildingSerializer(serializers.ModelSerializer):
    location = serializers.SerializerMethodField()

    class Meta:
        model = Building
        fields = ['id', 'name', 'location']

    def get_location(self, obj):
        if isinstance(obj.location, Point):
            return {"latitude": obj.location.y, "longitude": obj.location.x}
        return None  # Handle case where location is missing

class ShuttleStopSerializer(serializers.ModelSerializer):
    location = serializers.SerializerMethodField()

    class Meta:
        model = ShuttleStop
        fields = ['id', 'name', 'location']

    def get_location(self, obj):
        if isinstance(obj.location, Point):
            return {"latitude": obj.location.y, "longitude": obj.location.x}
        return None

class RouteSerializer(serializers.ModelSerializer):
    path = serializers.SerializerMethodField()

    class Meta:
        model = Route
        fields = ['id', 'name', 'path', 'mode_of_travel']

    def get_path(self, obj):
        if isinstance(obj.path, LineString):
            return [{"latitude": point[1], "longitude": point[0]} for point in obj.path.coords]
        return []
