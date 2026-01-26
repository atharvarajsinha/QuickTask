
from django.urls import path
from . import views

urlpatterns = [
    path('health/', views.health_check, name='health_check'),
    path('stats/', views.user_task_statistics, name='user_task_statistics'),
    path('productivity/', views.productivity_analytics, name='productivity_analytics'),
    path('public-stats/', views.public_stats, name='public_stats'),
]