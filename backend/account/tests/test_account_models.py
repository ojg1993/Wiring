from django.contrib.auth import get_user_model
from django.test import TestCase


class AccountModelTests(TestCase):
    """Test the Account model"""

    def test_create_superuser(self):
        """Test creating a superuser"""
        user = get_user_model().objects.create_superuser("admin", "adminpassword")
        self.assertTrue(user.is_superuser)
        self.assertTrue(user.is_staff)

    def test_create_user(self):
        """Test creating a new user"""
        user = get_user_model().objects.create_user(username="test", password="testpassword")
        self.assertEqual(user.username, "test")
        self.assertTrue(user.check_password("testpassword"))
