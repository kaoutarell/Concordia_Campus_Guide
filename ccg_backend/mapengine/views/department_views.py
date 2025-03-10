from django.views.decorators.http import require_http_methods
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from ..models.building import Building
from ..models.department import Department
from ..serializers.department_serializer import DepartmentSerializer


@api_view(["GET"])
@require_http_methods(["GET"])
def get_all_departments(request):
    departments = Department.objects.all()
    serializer = DepartmentSerializer(departments, many=True)
    return Response(serializer.data)


@api_view(["GET"])
@require_http_methods(["GET"])
def get_departments_by_building(request):
    building_id = request.GET.get("building_id")
    if not building_id:
        return Response({"error": "Missing building_id parameter"}, status=400)
    departments = Department.objects.filter(building__iexact=building_id)
    serializer = DepartmentSerializer(departments, many=True)
    return Response(serializer.data)
