import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'astro_chat_backend.settings')

app = Celery('astro_chat_backend')

app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()
