from django.shortcuts import render
from django.http import HttpResponse

def index(request):
    context = {'text': 'Welcome to our game'}
    # return HttpResponse("hello")
    return render(request, 'game/index.html', context)

def register(request):
    return HttpResponse("Register here")

def users(request):
    return HttpResponse("Leaderboard goes here")

def user_detail(request, user_id):
	return HttpResponse("This page will have user details")

def leaderboard(request):
    return HttpResponse("Leaderboard goes here")