from django.contrib.gis.db import models

class PointOfInterest(models.Model):
    name = models.CharField(max_length=100, default="")
    category = models.CharField(max_length=255, default="")
    location = models.PointField(srid=4326)
    campus = models.CharField(max_length=255, default="SGW")
    civic_address = models.CharField(max_length=255, default="")