
from django.contrib.gis.db import models

from .building import Building



class Service(models.Model):
    building = models.ForeignKey(Building, related_name='services', on_delete=models.CASCADE)
    link_text = models.CharField(max_length=255)
    link_path = models.CharField(max_length=255)

    def __str__(self):
        return self.link_text
