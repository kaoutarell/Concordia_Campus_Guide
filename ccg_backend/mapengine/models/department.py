from django.db import models
from .building import Building

BASE_URL = 'https://www.concordia.ca'

class Department(models.Model):
    building = models.ForeignKey(Building, related_name='departments', on_delete=models.CASCADE)
    link_text = models.CharField(max_length=255)
    link_path = models.CharField(max_length=255)

    def __str__(self):
        return self.link_text

