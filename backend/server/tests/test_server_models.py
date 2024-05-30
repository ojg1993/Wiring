import os
import shutil

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings

from ..models import Category, Channel, Server

TEMP_MEDIA_ROOT = os.path.join(settings.BASE_DIR, "test_media")


def get_category_icon_path(instance, filename):
    return os.path.join(TEMP_MEDIA_ROOT, f"category/{instance.id}/{filename}")


def get_server_icon_path(instance, filename):
    return f"server/{instance.name}/server_icon/{filename}"


def get_server_banner_path(instance, filename):
    return f"server/{instance.name}/server_banner/{filename}"


@override_settings(MEDIA_ROOT=TEMP_MEDIA_ROOT)
class CategoryModelTests(TestCase):
    """Test the Category model"""

    def setUp(self):
        """Set up the test icon for the Category model"""
        self.icon_file = SimpleUploadedFile("test_icon.jpg", b"file_content", content_type="image/jpeg")

    def tearDown(self):
        """Delete the test media root directory after the test is done"""
        if os.path.exists(TEMP_MEDIA_ROOT):
            shutil.rmtree(TEMP_MEDIA_ROOT)

    def test_create_category_without_an_icon(self):
        """Test creating a new category without an icon"""
        category = Category.objects.create(
            name="test",
            description="test description",
        )
        self.assertEqual(category.name, "test")
        self.assertEqual(category.description, "test description")
        self.assertEqual(str(category), "test")

    def test_create_category_with_an_icon(self):
        """Test creating a new category with an icon"""
        category = Category.objects.create(name="test", description="test description", icon=self.icon_file)
        category.icon = self.icon_file
        category.save()

        self.assertEqual(category.name, "test")
        self.assertEqual(category.description, "test description")
        self.assertTrue(category.icon)

        # icon file path check
        icon_path = get_category_icon_path(category, "test_icon.jpg")

        self.assertTrue(os.path.exists(icon_path))

    def test_update_category_icon(self):
        """Test updating the icon of a category"""
        category = Category.objects.create(name="test", description="This is a test category", icon=self.icon_file)
        category.icon = self.icon_file
        new_icon = SimpleUploadedFile("new_icon.jpg", b"new_content", content_type="image/jpeg")

        category.icon = new_icon
        category.save()

        category.refresh_from_db()
        old_icon_path = get_category_icon_path(category, "test_icon.jpg")
        new_icon_path = get_category_icon_path(category, "new_icon.jpg")
        self.assertFalse(os.path.exists(old_icon_path))
        self.assertTrue(os.path.exists(new_icon_path))


@override_settings(MEDIA_ROOT=TEMP_MEDIA_ROOT)
class ServerModelTests(TestCase):
    """Test the Server model"""

    def setUp(self):
        """Set up the test icon for the Category model"""
        self.user = get_user_model().objects.create_user(username="test", password="password")
        self.category = Category.objects.create(name="Test Category")

        self.icon_file = SimpleUploadedFile("test_icon.jpg", b"file_content", content_type="image/jpeg")
        self.banner_file = SimpleUploadedFile("test_icon.jpg", b"file_content", content_type="image/jpeg")

    def tearDown(self):
        """Delete the test media root directory after the test is done"""
        if os.path.exists(TEMP_MEDIA_ROOT):
            shutil.rmtree(TEMP_MEDIA_ROOT)

    def test_create_server(self):
        """Test creating a new server"""
        server = Server.objects.create(
            name="Test Server",
            description="Test description",
            category=self.category,
            owner=self.user,
        )
        self.assertEqual(server.name, "Test Server")
        self.assertEqual(server.description, "Test description")
        self.assertEqual(server.category, self.category)
        self.assertEqual(server.owner, self.user)
        self.assertEqual(str(server), "Test Server")

    def test_server_icon_and_banner(self):
        """Test setting server icon and banner"""
        server = Server.objects.create(
            name="Test Server",
            description="Test description",
            category=self.category,
            owner=self.user,
            icon=self.icon_file,
            banner=self.banner_file,
        )
        self.assertTrue(server.icon)
        self.assertTrue(server.banner)

    def test_server_members(self):
        """Test adding members to the server"""
        test_member = get_user_model().objects.create_user(username="test2", password="password")

        server = Server.objects.create(
            name="Test Server",
            description="Test description",
            category=self.category,
            owner=self.user,
        )

        server.members.add(test_member)
        self.assertIn(test_member, server.members.all())

    def test_delete_server(self):
        """Test deleting a server"""
        server = Server.objects.create(
            name="Test Server",
            description="Test description",
            category=self.category,
            owner=self.user,
        )

        server_id = server.id
        server.delete()

        with self.assertRaises(Server.DoesNotExist):
            Server.objects.get(id=server_id)


class ChannelModelTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(username="test", password="password")
        self.category = Category.objects.create(name="Test Category")
        self.server = Server.objects.create(
            name="Test Server",
            description="Test description",
            category=self.category,
            owner=self.user,
        )

    def test_create_channel(self):
        """Create a new channel"""
        channel = Channel.objects.create(
            name="Test Channel",
            topic="Test Topic",
            server=self.server,
            owner=self.user,
        )

        self.assertEqual(channel.name, "Test Channel")
        self.assertEqual(channel.topic, "Test Topic")
        self.assertEqual(channel.server, self.server)
        self.assertEqual(channel.owner, self.user)

        self.assertEqual(str(channel), "Test Channel")
