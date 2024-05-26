from django.db.models import Count
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import AuthenticationFailed, ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Category, Server
from .schemas import server_list_docs
from .serializers import CategorySerializer, ServerSerializer


class ServerMembershipViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=["GET"])
    def is_member(self, request, server_id=None):
        server = get_object_or_404(Server, id=server_id)
        user = request.user
        is_member = server.members.filter(id=user.id).exists()

        return Response({"is_member": is_member})

    def create(self, request, server_id):
        server = get_object_or_404(Server, id=server_id)
        user = request.user

        if server.members.filter(id=user.id).exists():
            return Response({"error": "User is already a member of this server."}, status=status.HTTP_409_CONFLICT)

        server.members.add(user)
        return Response({"detail": "User has been successfully added to the server."}, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=["DELETE"])
    def remove_member(self, request, server_id):
        server = get_object_or_404(Server, id=server_id)
        user = request.user

        if not server.members.filter(id=user.id).exists():
            return Response({"error:": "User is not a member of this server."}, status=status.HTTP_404_NOT_FOUND)

        if server.owner == user:
            return Response({"error": "the server owner cannot leave the server."}, status=status.HTTP_409_CONFLICT)

        server.members.remove(user)
        return Response(
            {"detail": "User has been successfully removed from the server."}, status=status.HTTP_204_NO_CONTENT
        )


class CategoryListViewSet(viewsets.ViewSet):
    """
    A viewset for viewing a list of categories.

    This viewset provides a list endpoint for retrieving all categories.
    The list endpoint supports the GET method.
    """

    queryset = Category.objects.all()

    @extend_schema(responses=CategorySerializer)
    def list(self, request):
        """
        Handle GET request to retrieve a list of categories.

        This method retrieves a list of all categories from the database, serializes them
        using the CategorySerializer, and returns them in the response.

        Args:
            request (Request): HTTP GET request object.

        Returns:
            Response: A Response object containing serialized data of categories.
        """
        serializer = CategorySerializer(self.queryset, many=True)
        return Response(serializer.data)


class ServerListViewSet(viewsets.ViewSet):
    """
    A viewset for viewing a list of servers.

    This viewset provides a list endpoint for retrieving servers based on various query parameters.
    The list endpoint supports the GET method and allows filtering by category, user, server ID,
    and optionally includes the number of members in each server.
    """

    queryset = Server.objects.all()

    @server_list_docs
    def list(self, request):
        """
        Handle GET request to retrieve a list of servers.

        This method retrieves a list of servers based on the provided query parameters
        in the GET request. Servers can be filtered by category, user, or server ID, and
        the response can include the number of members for each server if requested.

        Args:
            request (Request): HTTP GET request object containing query parameters.

        Returns:
            Response: A Response object containing serialized data of servers.

        Raises:
            AuthenticationFailed: If the request is not authenticated and filtering
                by user or server ID is requested.
            ValidationError: If an invalid server ID is provided.

        Note: This method supports the following query parameters:
        - category: Filter servers by category name.
        - qty: Limit the number of servers returned.
        - by_user: Filter servers by the currently authenticated user.
        - by_serverid: Filter servers by a specific server ID.
        - with_num_members: Include the number of members in each server.

        Example:
            A GET request to `api/servers/?category=Tech&qty=10&by_user=true&with_num_members=true`
            will return a Response object containing a list of up to 10 servers in the "Tech" category
            that are associated with the currently authenticated user, with the number of members
            included in each server object.
        """

        category = request.query_params.get("category")
        qty = request.query_params.get("qty")
        by_user = request.query_params.get("by_user") == "true"
        by_server_id = request.query_params.get("by_server_id")

        # Optional computation: counting joined members of the server
        with_num_members = request.query_params.get("with_num_members") == "true"

        if category:
            self.queryset = self.queryset.filter(category__name=category)

        if by_user:
            if by_user and request.user.is_authenticated:
                user_id = request.user.id
                self.queryset = self.queryset.filter(members=user_id)
            else:
                raise AuthenticationFailed()

        if with_num_members:
            self.queryset = self.queryset.annotate(num_members=Count("members"))

        if by_server_id:
            try:
                self.queryset = self.queryset.filter(id=by_server_id)
                if not self.queryset.exists():
                    raise ValidationError(detail=f"Server with id {by_server_id} not found.")
            except ValueError:
                raise ValidationError(detail="Server value error.")

        if qty:
            self.queryset = self.queryset[: int(qty)]

        serializer = ServerSerializer(self.queryset, many=True, context={"num_members": with_num_members})
        return Response(serializer.data)
