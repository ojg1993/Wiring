from django.conf import settings
from rest_framework_simplejwt.authentication import JWTAuthentication


class JWTCookieAuthentication(JWTAuthentication):

    def authenticate(self, request):
        token = request.COOKIES.get(settings.SIMPLE_JWT["ACCESS_TOKEN_NAME"])

        if token is None:
            return None

        validated_token = self.get_validated_token(token)
        return self.get_user(validated_token), validated_token
