from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from server.models import Category, Channel, Server
from server.serializers import CategorySerializer, ChannelSerializer, ServerSerializer

CATEGORY_LIST_URL = reverse("category-list")
SERVER_LIST_URL = reverse("server-list")


class CategoryAPITest(APITestCase):
    """Test the Category API."""

    def test_user_category_list(self):
        """Test getting a list of cateogories"""

        self.category = Category.objects.create(name="Test Category")
        self.category2 = Category.objects.create(name="Test Category 2")

        response = self.client.get(CATEGORY_LIST_URL)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)


class ServerAPITest(APITestCase):
    """Test the Server API."""

    def setUp(self):
        self.user = get_user_model().objects.create_user(username="testuser", password="testpassword")
        self.category = Category.objects.create(name="Test Category")
        self.server = Server.objects.create(
            name="Test Server",
            description="Test server description",
            category=self.category,
            owner=self.user,
        )

    def test_server_list_no_parameter(self):
        """Test getting a list of servers without query parameters"""
        response = self.client.get(SERVER_LIST_URL)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_server_list_with_id_parameter(self):
        """Test getting a list of servers with server id parameters"""
        response = self.client.get(f"{SERVER_LIST_URL}?by_server_id={self.server.id}")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_server_list_with_by_user_parameter_unauth(self):
        """Test getting a list of servers having the auth user as a member as unauthenticated user"""
        response = self.client.get(f"{SERVER_LIST_URL}?by_user=true")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_server_list_with_by_user_parameter_auth(self):
        """Test getting a list of servers having the auth user as a member as authenticated user"""
        self.client.force_authenticate(user=self.user)
        response = self.client.get(f"{SERVER_LIST_URL}?by_user=true")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_server_list_with_category_parameter(self):
        """Test getting a list of servers having the category as parameter category name"""
        response = self.client.get(f"{SERVER_LIST_URL}?category={self.category.name}")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_server_list_with_qty_parameter(self):
        """Test getting a qty numbers of of servers"""
        response = self.client.get(f"{SERVER_LIST_URL}?qty=0")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

        response = self.client.get(f"{SERVER_LIST_URL}?qty=1")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_server_list_with_with_num_members_parameter(self):
        """Test getting a list of of servers having a number of members attribute"""
        response = self.client.get(f"{SERVER_LIST_URL}?with_num_members=true")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]["num_members"], 0)


class ServerMembershipAPITest(APITestCase):
    """Test the Server Membership API."""

    def setUp(self):
        self.user = get_user_model().objects.create_user(username="testuser", password="testpassword")
        self.user2 = get_user_model().objects.create_user(username="testuser2", password="testpassword2")
        self.category = Category.objects.create(name="Test Category")
        self.server = Server.objects.create(
            name="Test Server",
            description="Test server description",
            category=self.category,
            owner=self.user,
        )
        self.client.force_authenticate(user=self.user)

        self.is_member_url = f"/api/membership/{self.server.id}/is_member/"
        self.add_member_url = f"/api/membership/{self.server.id}/"
        self.remove_member_url = f"/api/membership/{self.server.id}/remove_member/"

    def test_is_member(self):
        """Test checking if a user is a member of a server"""
        self.server.members.add(self.user)
        response = self.client.get(self.is_member_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["is_member"])

    def test_is_not_member(self):
        """Test checking if a user is not a member of a server"""
        response = self.client.get(self.is_member_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data["is_member"])

    def test_add_member(self):
        """Test adding a user to a server"""
        self.client.force_authenticate(user=self.user2)
        response = self.client.post(self.add_member_url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn(self.user2, self.server.members.all())

    def test_add_member_already_exists(self):
        """Test adding a user to a server when the user is already a member"""
        self.server.members.add(self.user2)
        self.client.force_authenticate(user=self.user2)
        response = self.client.post(self.add_member_url)
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)

    def test_remove_server_member(self):
        """Test removing a user from a server"""
        self.server.members.add(self.user2)
        self.client.force_authenticate(user=self.user2)
        response = self.client.delete(self.remove_member_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertNotIn(self.user2, self.server.members.all())

    def test_error_remove_no_server_member(self):
        """Test removing a user from a server when they are not a member"""
        self.client.force_authenticate(user=self.user2)
        response = self.client.delete(self.remove_member_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_error_remove_server_owner(self):
        """Test removing the owner from the server"""
        self.server.members.add(self.user)
        response = self.client.delete(self.remove_member_url)
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)
