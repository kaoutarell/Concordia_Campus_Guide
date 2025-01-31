from django.contrib.gis.db import models

from django.contrib.postgres.fields import ArrayField
import json


class Building(models.Model):
    name = models.CharField(max_length=100)
    building_code = models.CharField(max_length=10, default="UNKNOWN")
    location = models.PointField(srid=4326)
    civic_address = models.CharField(max_length=255, default="UNKNOWN")
    campus = models.CharField(max_length=10, default="SGW")

    # Boolean fields for building attributes
    parking_lot = models.BooleanField(default=False)
    accessibility = models.BooleanField(default=False)
    atm = models.BooleanField(default=False)
    bikerack = models.BooleanField(default=False)
    infokiosk = models.BooleanField(default=False)

    # JSON field to store services and department links
    services_links = ArrayField(models.JSONField(), blank=True, default=list)
    departments_links = ArrayField(models.JSONField(), blank=True, default=list)

    def __str__(self):
        return f"{self.name} ({self.building_code})"

    @classmethod
    def get_buildings_by_campus(cls, campus_name):
        return cls.objects.filter(campus=campus_name)
    def add_service_link(self, link_text, link_path, link_target=False, item_class=""):
        """Helper function to add a service link."""
        link_data = {
            "linkText": link_text,
            "linkPath": link_path,
            "linkTarget": link_target,
            "itemClass": item_class,
        }
        self.services_links.append(link_data)
        self.save()

    def add_department_link(self, link_text, link_path, link_target=False, item_class=""):
        """Helper function to add a department link."""
        link_data = {
            "linkText": link_text,
            "linkPath": link_path,
            "linkTarget": link_target,
            "itemClass": item_class,
        }
        self.departments_links.append(link_data)
        self.save()

