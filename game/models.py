from django.db import models

class Location(models.Model):
	location_text = models.CharField(max_length=200)
	infection_rate = models.IntegerField(default=50)
