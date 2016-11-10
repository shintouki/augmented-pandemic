from django.shortcuts import render

def index(request):
    context = {'text': 'Welcome to our game'}
    return render(request, 'polls/index.html', context)

def register(request):
    return HttpResponse("Register here")

def users(request):
    return HttpResponse("Leaderboard goes here")

def user_detail(request, user_id):
	return HttpResponse("This page will have user details")

def leaderboard(request):
    return HttpResponse("Leaderboard goes here")