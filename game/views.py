from django.shortcuts import render
from django.http import HttpResponse
from django.core import serializers
import json

from .models import Location

def index(request):
    context = {'text': 'Welcome to our game'}
    return render(request, 'game/index.html', context)

# This isn't used right now
# def register(request):
#     context = {'text': 'Register here'}
#     return render(request, 'registration/register.html', context)

def users(request):
	context = {'text': 'User list here'}
	return render(request, 'game/users.html', context)

def user_detail(request, user_id):
	return HttpResponse("This page will have user details")

def leaderboard(request):
    context = {'text': 'Leaderboard goes here'}
    return render(request, 'game/leaderboard.html', context)

def play(request):
    # context = {'text': 'Leaderboard goes here'}
    return render(request, 'game/play.html')

def infection_rates(request):
    location_list = Location.objects.all()

    # Infection rates
    output = serializers.serialize('json', location_list)
    return HttpResponse(output, content_type='application/json')