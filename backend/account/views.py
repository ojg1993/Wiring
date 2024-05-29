from account.serializers import (
    AccountSerializer,
    CustomTokenObtainPairSerializer,
    JWTCookieTokenRefreshSerializer,
    RegisterSerializer,
)
from django.conf import settings
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .models import Account
from .schemas import (
    account_list_docs,
    account_logout_docs,
    account_register_docs,
    jwt_token_obtain_docs,
    jwt_token_refresh,
)


class RegisterAPIView(APIView):

    @account_register_docs
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data["username"]

            forbidden_usernames = ["admin", "root", "superuser"]
            if username in forbidden_usernames:
                return Response({"error": ["Forbidden username"]}, status=status.HTTP_409_CONFLICT)

            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        errors = serializer.errors
        if "username" in errors and "non_field_errors" not in errors:
            return Response({"error": "Username already exists"}, status=status.HTTP_409_CONFLICT)

        return Response(errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    @account_logout_docs
    def post(self, request, format=None):
        response = Response("Successfully logged out.")

        response.delete_cookie(settings.SIMPLE_JWT["ACCESS_TOKEN_NAME"])
        response.delete_cookie(settings.SIMPLE_JWT["REFRESH_TOKEN_NAME"])
        return response


class AccountViewSet(viewsets.ViewSet):
    queryset = Account.objects.all()
    permission_classes = [IsAuthenticated]

    @account_list_docs
    def list(self, request):
        user_id = request.query_params.get("user_id")
        queryset = Account.objects.get(id=user_id)
        serializer = AccountSerializer(queryset)
        return Response(serializer.data)


class JWTSetCookieMixin:
    def finalize_response(self, request, response, *args, **kwargs):
        if response.data.get("refresh"):
            response.set_cookie(
                settings.SIMPLE_JWT["REFRESH_TOKEN_NAME"],
                response.data["refresh"],
                max_age=settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"],
                httponly=True,
                samesite=settings.SIMPLE_JWT["JWT_COOKIE_SAMESITE"],
            )

        if response.data.get("access"):
            response.set_cookie(
                settings.SIMPLE_JWT["ACCESS_TOKEN_NAME"],
                response.data["access"],
                max_age=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"],
                httponly=True,
                samesite=settings.SIMPLE_JWT["JWT_COOKIE_SAMESITE"],
            )
            del response.data["access"]

        return super().finalize_response(request, response, *args, **kwargs)


class JWTCookieTokenObtainPairView(JWTSetCookieMixin, TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    @jwt_token_obtain_docs
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class JWTCookieTokenRefreshView(JWTSetCookieMixin, TokenRefreshView):
    serializer_class = JWTCookieTokenRefreshSerializer

    @jwt_token_refresh
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)
