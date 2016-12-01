from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class Location(models.Model):
    location_text = models.CharField(max_length=200)
    # infection_rate = models.IntegerField(default=30)
    matches_lost = models.IntegerField(default=30)
    matches_won = models.IntegerField(default=70)
    total_matches = model.IntegerField(self.matches_won + self.matches_lost)

    def __str__(self):
        return self.location_text

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    matches_won = models.IntegerField(default=0)
    matches_lost = models.IntegerField(default=0)
    total_matches = models.IntegerField(default=0)
