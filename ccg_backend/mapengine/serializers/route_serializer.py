from rest_framework import serializers
from django.contrib.gis.geos import Point, LineString

from ..models.route import Route


class RouteSerializer(serializers.ModelSerializer):
    path = serializers.SerializerMethodField()

    class Meta:
        model = Route
        fields = ['id', 'name', 'path', 'mode_of_travel']

    def get_path(self, obj):
        if isinstance(obj.path, LineString):
            return [{"latitude": point[1], "longitude": point[0]} for point in obj.path.coords]
        return []
