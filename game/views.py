"""Game views"""
import json
from django.shortcuts import get_object_or_404, render
from django.http import HttpResponseRedirect, HttpResponse
from django.urls import reverse
from django.core import serializers
from .models import Location
from .models import Safezone

def index(request):
    """Homepage view"""
    context = {'text': 'Welcome to our game'}
    return render(request, 'game/index.html', context)

# This isn't used right now
# def register(request):
#     context = {'text': 'Register here'}
#     return render(request, 'registration/register.html', context)

def users(request):
    """User list view"""
    context = {'text': 'User list here'}
    return render(request, 'game/users.html', context)

def user_detail(request, user_id):
    """User profile view"""
    return HttpResponse("This page will have user details")

def leaderboard(request):
    """Leaderboard view"""
    context = {'text': 'Leaderboard goes here'}
    return render(request, 'game/leaderboard.html', context)

def play(request):
    """Game view"""
    # context = {'text': 'Leaderboard goes here'}
    return render(request, 'game/play.html')

def location_json(request):
    """Retrieving location information"""
    location_list = Location.objects.all()
    location_json_list = serializers.serialize('json', location_list)
    # Convert JSON to python dict
    location_object = json.loads(location_json_list)

    # Create a new object and make the keys be the location names so it's easier to search later
    output_object = {}
    for location in location_object:
        location_text = location['fields']['location_text']
        output_object[location_text] = location
    return HttpResponse(json.dumps(output_object), content_type='application/javascript')

def safezone_json(request):
    """Retrieving safezone locations"""
    safezone_list = Safezone.objects.all()
    safezone_json_list = serializers.serialize('json', safezone_list)
    # Convert JSON to python dict
    safezone_object = json.loads(safezone_json_list)

    # Create a new object and make the keys be the location names so it's easier to search later
    output_object = {}
    for location in safezone_object:
        location_text = location['fields']['location_text']
        output_object[location_text] = location
    return HttpResponse(json.dumps(output_object), content_type='application/javascript')

def win(request, location_name):
    """Saving matches won to database"""
    location = get_object_or_404(Location, location_text=location_name)
    location.matches_won += 1
    location.save()
    return HttpResponse("matches_won increased by 1")

def lose(request, location_name):
    """Saving matches lost to database"""
    location = get_object_or_404(Location, location_text=location_name)
    location.matches_lost += 1
    location.save()
    return HttpResponse("matches_lost increased by 1")
