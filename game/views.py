"""Game views"""
import json
from django.shortcuts import get_object_or_404, render
from django.http import HttpResponseRedirect, HttpResponse
from django.urls import reverse
from django.core import serializers
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django.views import View

from .models import Location, User
from .models import Safezone
from .models import Announcement
from .models import Profile

def index(request):
    """Homepage view"""
    context = {'text': 'Welcome to our game'}
    return render(request, 'game/index.html', context)

def logout_successful(request):
    context = {'text': 'Logout successful'}
    return render(request, 'game/logout_successful.html', context)
"""
def ajax_user_search( request ):

    if request.is_ajax():
        q = request.GET.get( 'q' )
        if q is not None:
            results = User.objects.filter(username=q)

            return render_to_response( 'users.html', { 'results': results, },
                                       context_instance = RequestContext( request ) )
"""
def users(request):
    """User search home"""
    context = {'text': 'Find a user:'}
    return render(request, 'game/users.html', context)

def user_search(request):
    """User search request"""
    query = request.GET.get('user_id')
    if query:
        results = User.objects.filter(username__contains=query)
        if results == None:
            results = 'No users found.'
        context = {'text': 'Find a user:', 'searched': query,'results': results}
    else:
        context = {'searched': 'No input detected.'}
    return render(request, 'game/search_results.html', context)

@login_required()
def user_detail(request):
    """User profile view"""
    current_user = request.user
    context = {'username': current_user.username,
               'total_matches': int(current_user.profile.total_matches()),
               'matches_won': int(current_user.profile.matches_won),
               'win_rate': round(current_user.profile.success_rate(), 2)
    }
    return render(request, 'game/user_detail.html', context)

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

    if request.user.is_authenticated:
        current_user = request.user
        current_user.profile.matches_won += 1
        current_user.profile.save()

    return HttpResponse("matches_won increased by 1")

def lose(request, location_name):
    """Saving matches lost to database"""
    location = get_object_or_404(Location, location_text=location_name)
    location.matches_lost += 1
    location.save()

    if request.user.is_authenticated:
        current_user = request.user
        current_user.profile.matches_lost += 1
        current_user.profile.save()

    return HttpResponse("matches_lost increased by 1")

def announcement_json(request):
    announcement_list = Announcement.objects.all()
    announcementJSON = serializers.serialize('json', announcement_list)
    # Convert JSON to python dict
    announcementObject = json.loads(announcementJSON)
    outputObject = {}
    for announcement in announcementObject:
        announcement_text = announcement['fields']['announcement_text']
        outputObject[announcement_text] = announcement
    return HttpResponse(json.dumps(outputObject), content_type='application/javascript')

def profile_json(request):
    pass
