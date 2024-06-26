from account.views import (
    AccountViewSet,
    JWTCookieTokenObtainPairView,
    JWTCookieTokenRefreshView,
    LogoutAPIView,
    RegisterAPIView,
)
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework.routers import DefaultRouter
from server.views import CategoryListViewSet, ServerListViewSet, ServerMembershipViewSet
from webchat.consumer import WebChatConsumer
from webchat.views import MessageViewSet

router = DefaultRouter()
router.register("api/categories", CategoryListViewSet)
router.register("api/servers", ServerListViewSet)
router.register("api/messages", MessageViewSet, basename="messages")
router.register("api/account", AccountViewSet)
router.register(r"api/membership/(?P<server_id>\d+)", ServerMembershipViewSet, basename="membership")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/docs/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/schema/ui/", SpectacularSwaggerView.as_view()),
    path("api/token/", JWTCookieTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", JWTCookieTokenRefreshView.as_view(), name="token_refresh"),
    path("api/logout/", LogoutAPIView.as_view(), name="logout"),
    path("api/register/", RegisterAPIView.as_view(), name="register"),
] + router.urls

websocket_urlpatterns = [
    path("ws/<str:serverId>/<str:channelId>/", WebChatConsumer.as_asgi()),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
