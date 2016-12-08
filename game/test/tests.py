"""Game application tests"""

#import datetime
#from django.utils import timezone
from django.test import TestCase
from django.urls import reverse
from game.models import Location, Profile, User

def create_user(username):
    """Create test user"""
    return User.objects.create(username=username)

def create_locations(location_text, matches_won, matches_lost):
    """Create test location"""
    return Location.objects.create(location_text=location_text,
                                   matches_won=matches_won,
                                   matches_lost=matches_lost)

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
        response = self.client.get(reverse('game:register'))
        self.assertEqual(response.status_code, 200)

class RegistrationTests(TestCase):
    pass

class UserViewTests(TestCase):
    """Testing users view"""
    def test_users_view_exists(self):
        """Test view exists"""
        response = self.client.get(reverse('game:users'))
        self.assertEqual(response.status_code, 200)

    def test_with_no_users(self):
        pass

    def test_with_one_user(self):
        pass

    def test_with_two_users(self):
        pass

    def test_with_multiple_users(self):
        pass

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
    # Testing location model
    def test_total_methods(self):
        """Test total matches method"""
        ccny = create_locations(location_text="CCNY", matches_won=70, matches_lost=30)
        self.assertEqual(ccny.total_matches(), 100)

    def test_infection_rate(self):
        """Test infection rate method"""
        ccny = create_locations(location_text="CCNY", matches_won=70, matches_lost=30)
        self.assertEqual(ccny.infection_rate(), 30)
