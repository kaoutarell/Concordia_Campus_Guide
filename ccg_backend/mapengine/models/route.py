
from django.contrib.gis.db import models
class Route(models.Model):
    name = models.CharField(max_length=100)
    path = models.LineStringField()  # Represents the route as a sequence of points
    mode_of_travel = models.CharField(
        max_length=10,
        choices=[('walking', 'Walking'), ('driving', 'Driving')]
    )

    def __str__(self):
        return self.name