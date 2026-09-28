from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import DeviceToken
from .serializers import DeviceTokenSerializer, NotificationSettingsSerializer

class RegisterDeviceTokenView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        token = request.data.get('token')
        platform = request.data.get('platform', 'unknown')

        if not token:
            return Response({'error': 'Token is required.'}, status=status.HTTP_400_BAD_REQUEST)

        device_token, created = DeviceToken.objects.update_or_create(
            token=token,
            defaults={'user': request.user, 'platform': platform}
        )

        serializer = DeviceTokenSerializer(device_token)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

class ToggleNotificationSettingsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = NotificationSettingsSerializer(request.user)
        return Response(serializer.data)

    def post(self, request):
        enabled = request.data.get('daily_reminder_enabled')
        if enabled is not None:
            request.user.daily_reminder_enabled = bool(enabled)
            request.user.save()

        serializer = NotificationSettingsSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)
