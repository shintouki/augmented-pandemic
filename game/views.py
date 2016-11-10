from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def index(request):
    return HttpResponse("Hello. Welcome to our game.")

def register(request):
    return HttpResponse("Register here")

def leaderboard(request):
    return HttpResponse("Leaderboard goes here")

def user_detail(request, user_id):
	return HttpResponse("This page will have user details")