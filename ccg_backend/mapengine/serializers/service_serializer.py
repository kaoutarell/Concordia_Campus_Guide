from rest_framework import serializers

from ..models.service import Service


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ["id", "building", "link_text", "link_path"]
