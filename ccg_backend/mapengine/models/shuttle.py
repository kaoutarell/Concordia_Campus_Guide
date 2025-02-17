from django.contrib.gis.db import models

class ShuttleStop(models.Model):
    name = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()

    def __str__(self):
        return self.name

class ShuttleSchedule(models.Model):
    campus = models.CharField(max_length=100)
    day_of_week = models.IntegerField(choices=[(i, i) for i in range(7)])
    time = models.TimeField(default="00:00:00")

    def __str__(self):
        return f"{self.stop.name} - {self.day_of_week}"
