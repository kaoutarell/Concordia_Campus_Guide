from django.urls import path
import mapengine.views as views

urlpatterns = [
    path('buildings/', views.building_list_create, name='building-list'),
    path('shuttle-stops/', views.shuttlestop_list_create, name='shuttle-stop-list'),
    path('routes/', views.route_list_create, name='route-list'),
]