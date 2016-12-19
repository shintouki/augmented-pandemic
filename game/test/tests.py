"""Game application tests"""

#import datetime
#from django.utils import timezone
from django.test import TestCase
from django.urls import reverse
from django.test.client import Client
from django.contrib.auth.models import User
from game.models import Location, Profile

class IndexViewTests(TestCase):
    """Testing index view"""

    def test_index_view_exists(self):
        """Test view works"""
        response = self.client.get(reverse('game:index'))
        self.assertEqual(response.status_code, 200)

class RegisterViewTests(TestCase):
    """Testing register view"""
    def test_register_view_exists(self):
        """Test view works"""
        response = self.client.get('registration:register')
        self.assertTemplateUsed(response, 'registration.html')

class RegistrationTests(TestCase):
    pass

class UserViewTests(TestCase):
    """Testing users view"""
    def test_users_view_exists(self):
        """Test view exists"""
        response = self.client.get(reverse('game:users'))
        self.assertEqual(response.status_code, 200)

class LeaderboardViewTests(TestCase):
    """Testing leaderboard view"""
    def test_leaderboard_view_exists(self):
        """Test view exists"""
        response = self.client.get(reverse('game:leaderboard'))
        self.assertEqual(response.status_code, 200)

class PlayViewTests(TestCase):
    """Testing play view"""
    def test_play_view_exists(self):
        """Test view exists"""
        response = self.client.get(reverse('game:play'))
        self.assertEqual(response.status_code, 200)

class LocationTestCase(TestCase):
    """Testing location model"""
    def test_total_methods(self):
        """
        Test total matches method,
        combines matches won and matches lost values
        """
        ccny = Location.objects.create(location_text="CCNY", matches_won=70, matches_lost=30)
        self.assertEqual(ccny.total_matches(), 100)

    def test_infection_rate(self):
        """
        Test infection rate method
        matches lost / total matches played
        """
        ccny = Location.objects.create(location_text="CCNY", matches_won=70, matches_lost=30)
        self.assertEqual(ccny.infection_rate(), 30)

class LogInTest(TestCase):
    def setup(self):
        test_user = User.objects.create_user('username', 'user@example.com', 'password')

    def test_login(self):
        pass

class UserProfileCase(TestCase):
    """Testing User Profile model"""
    def test_total_matchess(self):
        """
        Test total matches method,
        combines matches won and matches lost values
        """
        test_user = User.objects.create_user('username', 'user@example.com', 'password')
        test_user.profile.matches_won = 10
        test_user.profile.matches_lost = 20
        test_user.profile.save()

        self.assertEqual(test_user.profile.total_matches(), 30)
