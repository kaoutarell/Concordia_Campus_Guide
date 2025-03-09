from django.contrib.gis.db import models


class ShuttleStop(models.Model):
    name = models.CharField(max_length=100, default="")
    latitude = models.FloatField()
    longitude = models.FloatField()


class ShuttleSchedule(models.Model):
    campus = models.CharField(max_length=100, default="SGW")
    day_of_week = models.IntegerField(choices=[(i, i) for i in range(7)], default=0)
    time = models.TimeField(default="00:00:00")
