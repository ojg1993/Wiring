from rest_framework import status, viewsets
from rest_framework.response import Response

from .models import Conversation
from .schemas import list_message_docs
from .serializers import MessageSerializer


class MessageViewSet(viewsets.ViewSet):
    """
    A viewset for handling messages in a conversation.

    Methods:
    - list: Retrieves a list of messages in a conversation.
    """

    @list_message_docs
    def list(self, request):
        """
        Retrieves a list of messages in a conversation.

        Args:
            request (Request): HTTP GET request object containing query parameters.

        Returns:
            Response: A Response object containing serialized data of messages.

        Raises:
            DoesNotExist: If a conversation with the provided channel ID does not exist.

        Note: This method supports the following query parameters:
        - channel_id: Filter messages by the conversation's channel ID.

        Example:
            A GET request to `/api/messages/?channel_id=123`
            will return a Response object containing a list of messages in the conversation
            associated with the channel ID 123.
        """
        channel_id = request.query_params.get("channel_id")
        try:
            conversation = Conversation.objects.get(channel_id=channel_id)
            messages = conversation.conversation_messages.all()
            serializer = MessageSerializer(messages, many=True)
            return Response(serializer.data)
        except Conversation.DoesNotExist:
            return Response({"error": "Conversation with the given id not found"}, status=status.HTTP_404_NOT_FOUND)
