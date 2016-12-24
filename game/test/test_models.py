"""Game application tests"""

import datetime
#from django.utils import timezone
from django.test import TestCase
from django.urls import reverse
from django.test.client import Client
from django.contrib.auth.models import User
from game.models import Location, Profile, Announcement, Safezone
#from unittest import mock

class LocationTestCase(TestCase):
    """Testing location model"""
    def test_return_location(self):
        """
        Return Location name
        """
        ccny = Location.objects.create(location_text="CCNY", matches_won=70, matches_lost=30)
        test_text = str(ccny.__str__())
        self.assertEqual(test_text, "CCNY")

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

class UserProfileTestCase(TestCase):
    """Testing User Profile model"""
    def test_user_profile_created(self):
        """
        Test profile created when user created
        """
        test_user = User.objects.create_user('username', 'user@example.com', 'password')
        #profile = test_user.profile
        self.assertEqual(True, hasattr(test_user, 'profile'))

    def test_return_user(self):
        """
        Return User attributed to Profile
        """
        test_user = User.objects.create_user('username', 'user@example.com', 'password')
        test_id = str(test_user.profile.__str__())
        self.assertEqual(test_id, 'username')

    def test_total_matches(self):
        """
        Test total matches method,
        combines matches won and matches lost values
        """
        test_user = User.objects.create_user('username', 'user@example.com', 'password')
        test_user.profile.matches_won = 10
        test_user.profile.matches_lost = 20
        test_user.profile.save()

        self.assertEqual(test_user.profile.total_matches(), 30)

    def test_success_rate_with_matches(self):
        """
        Test success rate method
        matches won / total matches played
        """
        test_user = User.objects.create_user('username', 'user@example.com', 'password')
        test_user.profile.matches_won = 10
        test_user.profile.matches_lost = 20
        test_user.profile.save()

        result = (1/3)*100
        result = round(result, 2)
        self.assertEqual(test_user.profile.success_rate(), result)

    def test_success_rate_with_no_matches(self):
        """
        Test success rate method with no matches played
        """
        test_user = User.objects.create_user('username', 'user@example.com', 'password')
        result = 0
        self.assertEqual(test_user.profile.success_rate(), result)

class SafezoneTestCase(TestCase):
    """Testing Safezone model"""
    def test_return_safezone(self):
        """
        Return  Safezone name
        """
        test_zone = Safezone.objects.create(location_text="ccny", antidotes_given_out="0")
        test_id = str(test_zone.__str__())
        self.assertEqual(test_id, "ccny")

class AnnouncementTestCase(TestCase):
    """Testing Announcement model"""
    def test_return_safezone(self):
        """
        Return Announcement contents
        """
        test_announcement = Announcement.objects.create(announcement_text="Hello!", pub_date=datetime.date(2016, 12, 1))
        test_text = str(test_announcement.__str__())
        self.assertEqual(test_text, "Hello!")
