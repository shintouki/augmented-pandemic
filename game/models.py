from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class Location(models.Model):
    location_text = models.CharField(max_length=200)
    infection_rate = models.IntegerField(default=50)

    def __str__(self):
        return self.location_text

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    matches_won = models.IntegerField(default=0)
