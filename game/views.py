from django.shortcuts import render
from django.http import HttpResponse
from django.utils import simplejson

def index(request):
    context = {'text': 'Welcome to our game'}
    return render(request, 'game/index.html', context)

def register(request):
    context = {'text': 'Register here'}
    return render(request, 'registration/register.html', context)

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

def my_ajax_view(request):
    
    return HttpResponse(simplejson.dumps(some_data), mimetype='application/json')