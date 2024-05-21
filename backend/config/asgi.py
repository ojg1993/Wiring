import os

from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django_asgi_app = get_asgi_application()

from . import urls  # noqa isort: skip
from webchat.middleware import JWTAuthMiddleWare  # noqa isort: skip

application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": JWTAuthMiddleWare(URLRouter(urls.websocket_urlpatterns)),
    }
)
