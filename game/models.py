from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class Location(models.Model):
    location_text = models.CharField(max_length=200)
    # infection_rate = models.IntegerField(default=30)
    matches_lost = models.IntegerField(default=0)
    matches_won = models.IntegerField(default=0)

    def total_matches(self):
        won = self.matches_won
        lost = self.matches_lost
        return float(won + lost)

    def infection_rate(self):
        # "Returns infection rate of location"
        rate = (self.matches_lost / self.total_matches())*100
        return rate

    def __str__(self):
        return self.location_text

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    matches_won = models.IntegerField(default=0)
    matches_lost = models.IntegerField(default=0)
    # total_matches = models.IntegerField(default=0)

    """def success_rate(self):
        "Returns matches won out of total matches"
        success = (self.matches_won / self.total_matches)*100
        return success"""
