from rest_framework import serializers
from ..models.department import Department

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'building', 'link_text', 'link_path']