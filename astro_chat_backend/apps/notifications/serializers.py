from rest_framework import serializers
from .models import DeviceToken
from django.contrib.auth import get_user_model

User = get_user_model()

class DeviceTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeviceToken
        fields = ('id', 'token', 'platform', 'created_at', 'updated_at')

class NotificationSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'daily_reminder_enabled',)
