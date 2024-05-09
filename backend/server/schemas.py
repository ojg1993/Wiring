from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import OpenApiParameter, extend_schema

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
