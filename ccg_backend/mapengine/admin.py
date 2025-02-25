from django.contrib import admin
from .models import Building, Route, Department, Service, ShuttleSchedule, ShuttleStop

admin.site.register(Building)
admin.site.register(Route)
admin.site.register(Department)
admin.site.register(Service)
admin.site.register(ShuttleSchedule)
admin.site.register(ShuttleStop)

# Register your models here.
