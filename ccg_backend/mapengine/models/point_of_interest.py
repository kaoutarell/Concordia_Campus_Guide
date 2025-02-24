from django.contrib.gis.db import models

class PointOfInterest(models.Model):
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=255)
    location = models.PointField(srid=4326)
    campus = models.CharField(max_length=255)