import json

from django.contrib.gis.db import models


class Building(models.Model):
    name = models.CharField(max_length=100)
    building_code = models.CharField(max_length=10, default="UNKNOWN")
    location = models.PointField(srid=4326)
    civic_address = models.CharField(max_length=255, default="UNKNOWN")
    campus = models.CharField(max_length=10, default="SGW")
    image = models.CharField(max_length=255, default="")

    # Boolean fields for building attributes
    parking_lot = models.BooleanField(default=False)
    accessibility = models.BooleanField(default=False)
    atm = models.BooleanField(default=False)
    bikerack = models.BooleanField(default=False)
    infokiosk = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} ({self.building_code})"

    @classmethod
    def get_buildings_by_campus(cls, campus_name):
        return cls.objects.filter(campus=campus_name)
