from django.conf import settings
from django.db import models
from django.dispatch import receiver
from django.shortcuts import get_object_or_404

from . import validators


def category_icon_upload_path(instance, filename):
    return f"category/{instance.name}/{filename}"


def server_icon_upload_path(instance, filename):
    return f"server/{instance.name}/server_icon/{filename}"


def server_banner_upload_path(instance, filename):
    return f"server/{instance.name}/server_banner/{filename}"


class Category(models.Model):
    name = models.CharField(max_length=30)
    description = models.TextField(blank=True, null=True)
    icon = models.FileField(
        upload_to=category_icon_upload_path,
        null=True,
        blank=True,
        validators=[
            validators.validate_icon_image_size,
            validators.validate_image_file_extensions,
        ],
    )

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if self.id:
            prev = get_object_or_404(Category, id=self.id)

            if prev.icon != self.icon:
                prev.icon.delete(save=False)
        self.name = self.name.lower()
        super(Category, self).save(*args, **kwargs)

    @receiver(models.signals.post_delete, sender="server.Category")
    def category_delete_files(sender, instance, **kwargs):
        for field in instance._meta.fields:
            if field.name == "icon":
                file = getattr(instance, field.name)
                if file:
                    file.delete(save=False)


class Server(models.Model):
    name = models.CharField(max_length=30)
    description = models.TextField(blank=True, null=True)
    members = models.ManyToManyField(settings.AUTH_USER_MODEL)
    banner = models.FileField(
        upload_to=server_banner_upload_path,
        null=True,
        blank=True,
        validators=[
            validators.validate_image_file_extensions,
        ],
    )
    icon = models.FileField(
        upload_to=server_icon_upload_path,
        null=True,
        blank=True,
        validators=[
            validators.validate_icon_image_size,
            validators.validate_image_file_extensions,
        ],
    )
    # FK
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="server_category")
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="server_owner")

    def __str__(self):
        return self.name


class Channel(models.Model):
    name = models.CharField(max_length=30)
    topic = models.CharField(max_length=50)
    # FK
    server = models.ForeignKey(Server, on_delete=models.CASCADE, related_name="channel_server")
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="channel_owner")

    def __str__(self):
        return self.name
