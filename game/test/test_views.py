from django.test import TestCase
from django.urls import reverse
from django.test.client import Client
from django.contrib.auth.models import User

class RegistrationTests(TestCase):
    pass

class IndexViewTests(TestCase):
    """Testing index view"""
    def test_index_view_exists(self):
        """Test view works"""
        response = self.client.get(reverse('game:index'))
        self.assertEqual(response.status_code, 200)

class LoginTestCase(TestCase):
    def test_login_view_exists(self):
        """Login view exists"""
        response = self.client.get('/login/')
        self.assertEqual(response.status_code, 200)

    def test_login_works(self):
        pass

class LogoutViewTests(TestCase):
    """Testing register view"""
    def test_register_view_exists(self):
        """Test view works"""
        response = self.client.get(reverse('game:logout_successful'))
        self.assertEqual(response.status_code, 200)

class UserViewTests(TestCase):
    """Testing users view"""
    def test_users_view_exists(self):
        """Test view exists"""
        response = self.client.get(reverse('game:users'))
        self.assertEqual(response.status_code, 200)

class UserProfileViewTests(TestCase):
    """Test viewing of user profile"""
    def test__view_when_logged_in(self):
        """Test logged in user can access view"""
        test_user = User.objects.create_user('username',
                                             'user@example.com', 'password')
        c = Client()
        c.login(username='username', password='password')
        response = self.client.get(reverse('game:user_detail'))
        self.assertEqual(response.status_code, 200)
    def test__view_when_not_logged_in(self):
        """Test view cannot be accessed"""
        response = self.client.get(reverse('game:user_detail'))
        self.assertRedirects(response, '/login')

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
