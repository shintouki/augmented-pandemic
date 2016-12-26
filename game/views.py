"""Game views"""
import json
import logging
logger = logging.getLogger(__name__)
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
    """Displays logout success message when user log out"""
    context = {'text': 'Logout successful'}
    return render(request, 'game/logout_successful.html', context)

def users(request):
    """User search home"""
    context = {'text': 'Find a user:'}
    return render(request, 'game/users.html', context)

def user_search(request):
    """Receive search input and search database for user"""
    query = request.GET.get('user_id') # receive user input
    if query:
        users_found = User.objects.filter(username__contains=query) # find users based on input
        if not users_found: # if no users found based on user input
            none = 'No users found.'
            context = {'searched': query, 'none': none}
        else:
            rates = []
            for i in users_found: # if users found based on user input
                rates.append(i.profile.success_rate()) # get user success rates from user's profile
                results = zip(users_found, rates) # zip lists for easy iteration
            context = {'searched': query, 'results': results}
    else:
        context = {'searched': 'No input detected.'} # if no input sent

    return render(request, 'game/search_results.html', context)

def user_detail(request):
    """User profile view"""
    if request.user.is_authenticated: # get user profile info if logged in
        current_user = request.user
        context = {'username': current_user.username,
                   'total_matches': int(current_user.profile.total_matches()),
                   'matches_won': int(current_user.profile.matches_won),
                   'win_rate': current_user.profile.success_rate(),
                   'num_antidotes': current_user.profile.num_antidotes
                  }
        return render(request, 'game/user_detail.html', context)
    else:
        return HttpResponseRedirect('/login')

def leaderboard(request):
    """Leaderboard view *Noted naive sorting logic to not risk breaking app"""
    get_users = Profile.objects.order_by('-matches_won')[:5]
    #get_users = Profile.objects.order_by('-success_rate')[:5]
    text = ""
    if not get_users:
        text = "No users in database yet."
    rates = []
    user_list = []
    matches = []
    for i in get_users: # get 3 lists with username, succes rate, and total matches played
        current_user = i.user
        user_list.append(current_user.username)
        rates.append(i.success_rate())
        matches.append(int(i.total_matches()))
    ranking = list(zip(user_list, rates, matches)) # zip for easy iteration
    context = {'text': text, 'ranking': ranking, 'get_users': get_users, 'matches': matches,
               'rates': rates}

    return render(request, 'game/leaderboard.html', context)

def play(request):
    """Game view"""
    current_user = request.user
    if current_user.is_anonymous(): # user must be logged in to get data
        num_antidotes = "Please log in to use antidotes!"
    else:
        num_antidotes = current_user.profile.num_antidotes
    context = {'antidotes': num_antidotes}

    return render(request, 'game/play.html', context)

def location_json(request):
    """Retrieving location information from db"""
    if request.method == "GET":
        location_list = Location.objects.all()
        location_json_list = serializers.serialize('json', location_list)
        location_object = json.loads(location_json_list) # Convert JSON to python dict

        # Create a new object and make the keys be the location names so it's easier to search later
        output_object = {}
        for location in location_object:
            location_text = location['fields']['location_text']
            output_object[location_text] = location

        return HttpResponse(json.dumps(output_object), content_type='application/javascript')

def safezone_json(request):
    """Retrieving safezone locations from db"""
    if request.method == "GET":
        safezone_list = Safezone.objects.all()
        safezone_json_list = serializers.serialize('json', safezone_list)
        safezone_object = json.loads(safezone_json_list) # Convert JSON to python dict

        # Create a new object and make the keys be the location names so it's easier to search later
        output_object = {}
        for location in safezone_object:
            location_text = location['fields']['location_text']
            output_object[location_text] = location

        return HttpResponse(json.dumps(output_object), content_type='application/javascript')
# Fix this
def current_profile_json(request):
    """Retrieving user profile data from db"""
    if request.method == "GET":
        if request.user.is_authenticated:
            current_user = request.user
            output_object = {}
            output_object['num_antidotes'] = current_user.profile.num_antidotes
            return HttpResponse(json.dumps(output_object), content_type='application/javascript')
        else:
            return HttpResponse("No logged in user")

def win(request, location_name):
    """Saving matches won to db"""
    if request.method == "POST":
        location = get_object_or_404(Location, location_text=location_name) #get current location
        location.matches_won += 1
        location.save()

        # save win information to current user's profile
        if request.user.is_authenticated:
            current_user = request.user
            current_user.profile.matches_won += 1
            current_user.profile.save()

    return HttpResponse("matches_won increased by 1")

def lose(request, location_name):
    """Saving matches lost to db"""
    if request.method == "POST":
        location = get_object_or_404(Location, location_text=location_name)
        location.matches_lost += 1
        location.save()

        # save lose information to current user's profile
        if request.user.is_authenticated:
            current_user = request.user
            current_user.profile.matches_lost += 1
            current_user.profile.save()

    return HttpResponse("matches_lost increased by 1")

def antidoteReceived(request, location_name):
    """Saving antidotes changes to db"""
    if request.method == "POST":
        safezone = get_object_or_404(Safezone, location_text=location_name)
        safezone.antidotes_in_stock -= 1
        safezone.antidotes_given_out += 1
        safezone.save()

        # save increased antidote number information to current user's profile
        if request.user.is_authenticated:
            current_user = request.user
            current_user.profile.num_antidotes += 1
            current_user.profile.save()

    return HttpResponse("received antidote")

def antidoteUsed(request, location_name):
    """Saving antidotes changes to db"""
    if request.method == "POST":
        location = get_object_or_404(Location, location_text=location_name)
        location.matches_won += 5
        location.save()

        # save increased antidote number information to current user's profile
        if request.user.is_authenticated:
            current_user = request.user
            current_user.profile.num_antidotes -= 1
            current_user.profile.save()

    return HttpResponse("used antidote")

def announcement_json(request):
    """Retrieving announcements from db"""
    if request.method == "GET":
        announcement_list = Announcement.objects.all()
        announcement_json_list = serializers.serialize('json', announcement_list)
        announcement_object = json.loads(announcement_json_list) # Convert JSON to python dict

        # Create a new object and make the keys be the location names so it's easier to search later
        output_object = {}
        for announcement in announcement_object:
            announcement_text = announcement['fields']['announcement_text']
            output_object[announcement_text] = announcement

        return HttpResponse(json.dumps(output_object), content_type='application/javascript')

