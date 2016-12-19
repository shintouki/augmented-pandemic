"""Game app models"""

from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class Profile(models.Model):
    """User Profile model"""
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    matches_won = models.IntegerField(default=0)
    matches_lost = models.IntegerField(default=0)
    num_antidotes = models.IntegerField(default=0)

class Location(models.Model):
    """Regions of infection"""
    location_text = models.CharField(max_length=200)
    zone_text = models.CharField(max_length=200, default="")
    matches_lost = models.IntegerField(default=30)
    matches_won = models.IntegerField(default=70)

    def total_matches(self):
        """Returns total matches played in region"""
        won = self.matches_won
        lost = self.matches_lost
        return float(won + lost)

    def infection_rate(self):
        """Returns infection rate of location"""
        rate = (self.matches_lost / self.total_matches())*100
        return rate

    def __str__(self):
        """Returns location name"""
        return self.location_text

class Safezone(models.Model):
    """Regions of infection"""
    location_text = models.CharField(max_length=200)
    antidotes_given_out = models.IntegerField(default=0)

    def __str__(self):
        """Returns location name"""
        return self.location_text

class Announcement(models.Model):
    announcement_text = models.CharField(max_length=500)
    pub_date = models.DateTimeField('date published')

    def __str__(self):
        return self.announcement_text

class Profile(models.Model):
    """User Profile model"""
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    matches_won = models.IntegerField(default=0)
    matches_lost = models.IntegerField(default=0)
    num_antidotes = models.IntegerField(default=0)

    def total_matches(self):
        """Returns total matches played"""
        won = self.matches_won
        lost = self.matches_lost
        return float(won + lost)

    def success_rate(self):
        """Returns matches won out of total matches"""
        if self.total_matches() == 0:
            success = 0
            return success
        else:
            success = (self.matches_won / self.total_matches())*100
            return success

    def __str__(self):
        return self.user

    @receiver(post_save, sender=User)
    def create_user_profile(sender, instance, created, **kwargs):
        if created:
            Profile.objects.create(user=instance)

    #@receiver(post_save, sender=User)
    #def save_user_profile(sender, instance, **kwargs):
    #    instance.profile.save()
