from django.urls import path
from .views import PluginList, PluginToggle

urlpatterns = [
    path('', PluginList.as_view(), name='plugin-list'),
    path('<int:pk>/toggle/', PluginToggle.as_view(), name='plugin-toggle'),  # URL to toggle plugin status
]