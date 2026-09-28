from django.urls import path
from .views import RegisterDeviceTokenView, ToggleNotificationSettingsView

urlpatterns = [
    path('register-token', RegisterDeviceTokenView.as_view(), name='register_device_token'),
    path('settings', ToggleNotificationSettingsView.as_view(), name='notification_settings'),
]
