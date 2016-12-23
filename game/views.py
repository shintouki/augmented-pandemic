"""Game views"""
import json
from django.shortcuts import get_object_or_404, render
from django.http import HttpResponseRedirect, HttpResponse
#from django.urls import reverse
from django.core import serializers
#from django.contrib.auth import logout
#from django.views import View

from .models import Location, User
from .models import Safezone
from .models import Announcement
from .models import Profile

def index(request):
    """Homepage view"""
    context = {'text': 'Welcome to our game. Click "Fight the Infection" above to play!'}
    return render(request, 'game/index.html', context)

def logout_successful(request):
    """Displays logout sucess message when user log out"""
    context = {'text': 'Logout successful'}
    return render(request, 'game/logout_successful.html', context)

def users(request):
    """User search home"""
    context = {'text': 'Find a user:'}
    return render(request, 'game/users.html', context)

def user_search(request):
    """User search request"""
    query = request.GET.get('user_id')
    if query:
        users_found = User.objects.filter(username__contains=query)
        if not users_found:
            none = 'No users found.'
            context = {'searched': query, 'none': none}
        else:
            rates = []
            for i in users_found:
                rates.append(i.profile.success_rate())
                results = zip(users_found, rates)
            context = {'searched': query, 'results': results}
    else:
        context = {'searched': 'No input detected.'}
    return render(request, 'game/search_results.html', context)

def user_detail(request):
    """User profile view"""
    if request.user.is_authenticated:
        current_user = request.user
        context = {'username': current_user.username,
                   'total_matches': int(current_user.profile.total_matches()),
                   'matches_won': int(current_user.profile.matches_won),
                   'win_rate': current_user.profile.success_rate()
                  }
        return render(request, 'game/user_detail.html', context)
    else:
        return HttpResponseRedirect('/login')

def leaderboard(request):
    """Leaderboard view"""
    ranking = Profile.objects.order_by('-matches_won')[:5]
    rates = []
    user_list = []
    matches = []
    for i in ranking:
        current_user = i.user
        user_list.append(current_user.username)
        rates.append(i.success_rate())
        matches.append(int(i.total_matches()))
    rates = sorted(rates, reverse=True)
    ranking = zip(user_list, rates, matches)
    context = {'text': 'Leaderboard goes here', 'ranking': ranking}
    return render(request, 'game/leaderboard.html', context)

def play(request):
    """Game view"""
    current_user = request.user
    if current_user.is_anonymous():
        num_antidotes = "Please log in to save your progress!"
    else:
        num_antidotes = current_user.profile.num_antidotes
    context = {'antidotes': num_antidotes}
    return render(request, 'game/play.html', context)

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
    """Retrieving announcements"""
    announcement_list = Announcement.objects.all()
    announcement_json_list = serializers.serialize('json', announcement_list)
    # Convert JSON to python dict
    announcement_object = json.loads(announcement_json_list)
    output_object = {}
    for announcement in announcement_object:
        announcement_text = announcement['fields']['announcement_text']
        output_object[announcement_text] = announcement
    return HttpResponse(json.dumps(output_object), content_type='application/javascript')

def profile_json(request):
    """Retrieving user profile data"""
    pass
