from django.contrib.auth import get_user_model
from django.test import TestCase

from ..models import Conversation, Message


class WebchatModelTest(TestCase):
    """Test the Webchat model"""

    def test_create_conversation(self):
        """Test creating a conversation"""
        conversation = Conversation.objects.create(channel_id="test_channel_id")
        self.assertEqual(conversation.channel_id, "test_channel_id")

    def test_create_message(self):
        """Test creating a message"""
        user = get_user_model().objects.create_user(username="test", password="testpassword")
        conversation = Conversation.objects.create(channel_id="test_channel_id")
        message = Message.objects.create(conversation=conversation, sender=user, content="test content")
        self.assertEqual(message.content, "test content")
        self.assertEqual(message.sender, user)
        self.assertEqual(message.conversation, conversation)
