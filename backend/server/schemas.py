from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import OpenApiParameter, OpenApiResponse, extend_schema

from .serializers import ServerSerializer

server_list_docs = extend_schema(
    responses=ServerSerializer(many=True),
    parameters=[
        OpenApiParameter(
            name="category",
            required=False,
            type=OpenApiTypes.STR,
            location=OpenApiParameter.QUERY,
            description="Category name of servers to be returned",
        ),
        OpenApiParameter(
            name="qty",
            required=False,
            type=OpenApiTypes.INT,
            location=OpenApiParameter.QUERY,
            description="Limited number of servers to be returned.",
        ),
        OpenApiParameter(
            name="by_user",
            required=False,
            type=OpenApiTypes.BOOL,
            location=OpenApiParameter.QUERY,
            description="Servers filtered by the current auth user.",
        ),
        OpenApiParameter(
            name="by_server_id",
            required=False,
            type=OpenApiTypes.INT,
            location=OpenApiParameter.QUERY,
            description="Servers filter by a server ID.",
        ),
        OpenApiParameter(
            name="with_num_members",
            required=False,
            type=OpenApiTypes.BOOL,
            location=OpenApiParameter.QUERY,
            description="Include the number of members in each server.",
        ),
    ],
)

membership_is_member_docs = extend_schema(
    responses={
        200: OpenApiResponse(description="Returns a boolean indicating whether the user is a member of the server.")
    }
)

membership_create_docs = extend_schema(
    responses={
        201: OpenApiResponse(
            description="Returns a message indicating that the user has been successfully added to the server."
        ),
        409: OpenApiResponse(description="Returns an error message if the user is already a member of the server."),
    },
)


membership_remove_member_docs = extend_schema(
    responses={
        204: OpenApiResponse(
            description="Returns a message indicating that the user has been successfully removed from the server."
        ),
        404: OpenApiResponse(description="Returns an error message if the user is not a member of the server."),
        409: OpenApiResponse(description="Returns an error message if the user is the owner of the server."),
    }
)
