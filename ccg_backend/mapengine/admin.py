from django.contrib import admin
from .models import Building, ShuttleStop, Route

admin.site.register(Building)
admin.site.register(ShuttleStop)
admin.site.register(Route)

# Register your models here.
