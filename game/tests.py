import datetime

from django.utils import timezone
from django.test import TestCase
from django.urls import reverse

def create_user(question_text, days):
    pass

class UserViewTests(TestCase):
    def test_users_view_exists(self):
        response = self.client.get(reverse('game:users'))
        self.assertEqual(response.status_code, 200)

    def test_users_view_with_no_users(self):
    	pass

    def test_users_view_with_one_user(self):
    	pass

    def test_users_view_with_two_users(self):
    	pass

    def test_users_view_with_multiple_users(self):
    	pass


class RegistrationTests(TestCase):
	pass