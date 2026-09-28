from django.db import models
from django.conf import settings

class ChatMessage(models.Model):
    SENDER_USER = 'user'
    SENDER_ASTRO = 'astro'
    SENDER_CHOICES = (
        (SENDER_USER, 'User'),
        (SENDER_ASTRO, 'Astro'),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='chat_messages'
    )
    sender_type = models.CharField(max_length=10, choices=SENDER_CHOICES)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"{self.user.email} - {self.sender_type}: {self.message[:30]}"
