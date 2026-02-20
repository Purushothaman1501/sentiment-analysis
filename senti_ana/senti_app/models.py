from django.db import models
from django.conf import settings
    
# Create your models here.
class UserProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    bio = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username


class SentimentAnalysis(models.Model):
    user_profile = models.ForeignKey(
        'UserProfile',           # string reference (safe even if defined later)
        on_delete=models.CASCADE,
        related_name='sentiments'
    )
    text = models.TextField()
    sentiment = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user_profile.user.username} - {self.sentiment}"