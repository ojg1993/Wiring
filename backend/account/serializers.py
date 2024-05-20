from account.models import Account
from django.conf import settings
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer,
)


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ["username"]


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data["user_id"] = self.user.id
        return data


class JWTCookieTokenRefreshSerializer(TokenRefreshSerializer):
    refrest = None

    def validate(self, attrs):
        attrs["refresh"] = self.context["request"].COOKIES.get(settings.SIMPLE_JWT["REFRESH_TOKEN_NAME"])

        if attrs["refresh"]:
            return super().validate(attrs)
        else:
            raise ValidationError("No valid refresh token found in cookie")
