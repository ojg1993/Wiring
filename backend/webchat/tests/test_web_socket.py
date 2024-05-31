from channels.testing import WebsocketCommunicator
from django.contrib.auth import get_user_model
from django.test import TestCase
from server.models import Category, Server

from ..consumer import WebChatConsumer


class WebChatConsumerTestCase(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(username="testuser", password="testpassword")
        self.client.force_login(self.user)
        self.category = Category.objects.create(name="Test Category")
        self.server = Server.objects.create(name="Test Server", category=self.category, owner=self.user)
        self.server.members.add(self.user)
        self.channel_id = "123"
        self.socket_url = f"/ws/{self.server.id}/{self.channel_id}/"

    async def test_connect(self):
        communicator = WebsocketCommunicator(WebChatConsumer.as_asgi(), self.socket_url)
        communicator.scope["user"] = self.user
        communicator.scope["url_route"] = {"kwargs": {"serverId": self.server.id, "channelId": self.channel_id}}
        connected, _ = await communicator.connect()
        self.assertTrue(connected)

    async def test_receive_json(self):
        communicator = WebsocketCommunicator(WebChatConsumer.as_asgi(), self.socket_url)
        communicator.scope["user"] = self.user
        communicator.scope["url_route"] = {"kwargs": {"serverId": self.server.id, "channelId": self.channel_id}}
        connected, _ = await communicator.connect()
        self.assertTrue(connected)

        message = {"message": "Test message"}
        await communicator.send_json_to(message)
        response = await communicator.receive_json_from()
        self.assertEqual(response["new_message"]["content"], "Test message")

    async def test_disconnect(self):
        communicator = WebsocketCommunicator(WebChatConsumer.as_asgi(), self.socket_url)
        communicator.scope["user"] = self.user
        communicator.scope["url_route"] = {"kwargs": {"serverId": self.server.id, "channelId": self.channel_id}}
        connected, _ = await communicator.connect()
        self.assertTrue(connected)

        await communicator.disconnect()
