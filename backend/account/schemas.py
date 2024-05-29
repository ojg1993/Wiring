from drf_spectacular.utils import OpenApiParameter, OpenApiResponse, extend_schema

from .serializers import AccountSerializer, RegisterSerializer

account_list_docs = extend_schema(
    parameters=[OpenApiParameter(name="user_id", description="ID of the user to retrieve", required=True, type=int)],
    responses={200: AccountSerializer, 404: OpenApiResponse(description="User not found.")},
    description="Retrieve account details for a specific user.",
)

account_register_docs = extend_schema(
    request=RegisterSerializer,
    responses={
        201: OpenApiResponse(description="User successfully registered."),
        400: OpenApiResponse(description="Invalid input data."),
        409: OpenApiResponse(description="Forbidden username or username already exists."),
    },
    description="Register a new user. Username cannot be 'admin', 'root', or 'superuser'.",
)

account_logout_docs = extend_schema(
    responses={
        200: OpenApiResponse(description="Successfully logged out."),
    },
    description="Log out the current user and delete JWT cookies.",
)

jwt_token_obtain_docs = extend_schema(
    responses={
        200: OpenApiResponse(description="JWT token pair successfully obtained and set in cookies."),
        401: OpenApiResponse(description="Invalid credentials."),
    },
    description="Obtain JWT token pair and set them in cookies.",
)

jwt_token_refresh = extend_schema(
    responses={
        200: OpenApiResponse(description="JWT token pair successfully refreshed and set in cookies."),
        401: OpenApiResponse(description="Invalid refresh token."),
    },
    description="Refresh JWT token pair and set them in cookies.",
)
