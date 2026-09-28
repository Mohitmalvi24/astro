import os
import firebase_admin
from firebase_admin import credentials, messaging
from celery import shared_task
from django.contrib.auth import get_user_model
from .models import DeviceToken

User = get_user_model()

# Initialize Firebase Admin SDK safely
def init_firebase():
    if not firebase_admin._apps:
        creds_path = os.environ.get('FIREBASE_CREDENTIALS_PATH', 'firebase-service-account.json')
        if os.path.exists(creds_path):
            cred = credentials.Certificate(creds_path)
            firebase_admin.initialize_app(cred)
        else:
            print(f"Warning: Firebase credentials file not found at '{creds_path}'. Push notifications will be skipped.")

@shared_task
def send_daily_push_notifications():
    init_firebase()
    if not firebase_admin._apps:
        return "Firebase not initialized."

    # Filter active users with daily_reminder_enabled=True
    eligible_users = User.objects.filter(is_active=True, daily_reminder_enabled=True)
    tokens = list(DeviceToken.objects.filter(user__in=eligible_users).values_list('token', flat=True))

    if not tokens:
        return "No eligible tokens found."

    success_count = 0
    failure_count = 0

    # FCM batch sending
    for token in tokens:
        message = messaging.Message(
            notification=messaging.Notification(
                title="Astro",
                body="The stars are aligned. Come see what's written for you today."
            ),
            token=token
        )
        try:
            messaging.send(message)
            success_count += 1
        except Exception as e:
            print(f"Failed to send push to token {token[:10]}...: {e}")
            failure_count += 1

    return f"Daily notifications sent. Successes: {success_count}, Failures: {failure_count}"
