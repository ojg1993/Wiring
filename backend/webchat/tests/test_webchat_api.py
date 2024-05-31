from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from ..models import Conversation, Message


class MessageViewSetTest(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(username="testuser", password="testpassword")
        self.channel_id = "123"
        self.conversation = Conversation.objects.create(channel_id=self.channel_id)
        self.message1 = Message.objects.create(conversation=self.conversation, content="Hello", sender=self.user)
        self.message2 = Message.objects.create(conversation=self.conversation, content="World", sender=self.user)
        self.url = reverse("messages-list")

    def test_list_messages(self):
        """Test retrieving a list of messages in a conversation."""
        response = self.client.get(self.url, {"channel_id": self.channel_id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_list_messages_conversation_not_found(self):
        """Test retrieving a list of messages when conversation is not found."""
        response = self.client.get(self.url, {"channel_id": "this_is_random_id"})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data, {"error": "Conversation with the given id not found"})
