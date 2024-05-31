from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


class RegisterAPIViewTestCase(APITestCase):
    """Test case for the Register API"""

    def setUp(self):
        """Initialize the test client and set the URL for the register endpoint"""
        self.url = reverse("register")

    def test_register(self):
        """Test for successful user registration"""
        data = {"username": "testuser", "password": "testpassword"}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)  # Check if the response status is 201 Created
        self.assertTrue(
            get_user_model().objects.filter(username="testuser").exists()
        )  # Verify that the user was created


class LogoutAPIViewTestCase(APITestCase):
    """Test case for the Logout API"""

    def setUp(self):
        """Initialize the test client, create a user, and log in"""
        self.url = reverse("logout")
        self.test_account = get_user_model().objects.create_user(username="testuser", password="testpassword")
        self.client.force_authenticate(user=self.test_account)

    def test_logout(self):
        """Test for successful user logout"""
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)  # Check if the response status is 200 OK


class AccountViewSetTestCase(APITestCase):
    """Test case for the Account ViewSet"""

    def setUp(self):
        """Initialize the test client, set the URL for the account list, and create a user"""
        self.test_account = get_user_model().objects.create_user(username="testuser", password="testpassword")
        self.url = f"/api/account/?user_id={self.test_account.id}"

    def test_account_list(self):
        """Test for retrieving the account list"""
        self.client.force_authenticate(user=self.test_account)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)  # Check if the response status is 200 OK


class JWTCookieTokenObtainPairViewTestCase(APITestCase):
    """Test case for obtaining JWT token pair"""

    def setUp(self):
        """Initialize the test client, set the URL for token obtain pair, and create a user"""
        self.url = reverse("token_obtain_pair")
        self.test_account = get_user_model().objects.create_user(username="testuser", password="testpassword")

    def test_token_obtain_pair(self):
        """Test for obtaining JWT token pair"""
        data = {"username": "testuser", "password": "testpassword"}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue("access_token" in response.cookies)
        self.assertTrue("refresh_token" in response.cookies)


class JWTCookieTokenRefreshViewTestCase(APITestCase):
    """Test case for refreshing JWT token"""

    def setUp(self):
        """Initialize the test client, set the URL for token refresh, and create a user"""
        self.url = reverse("token_refresh")
        self.test_account = get_user_model().objects.create_user(username="testuser", password="testpassword")

    def test_token_refresh(self):
        """Test for refreshing JWT token"""

        # Obtain the token pair first
        obtain_url = reverse("token_obtain_pair")
        data = {"username": "testuser", "password": "testpassword"}
        response = self.client.post(obtain_url, data)
        refresh_token = response.cookies.get("refresh_token").value

        # Use the refresh token to get a new access token
        response = self.client.post(self.url, {"refresh": refresh_token})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue("access_token" in response.cookies)
