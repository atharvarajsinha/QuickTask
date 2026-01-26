import jwt, os
from django.http import JsonResponse

def jwt_required(view_func):
    def wrapper(request, *args, **kwargs):
        auth_header = request.headers.get("Authorization")

        if not auth_header or not auth_header.startswith("Bearer "):
            return JsonResponse({"message": "Not a valid User, please login/register"},status=401)

        token = auth_header.split(" ")[1]
        try:
            decoded = jwt.decode(
                token,
                os.getenv("JWT_SECRET"),
                algorithms=["HS256"]
            )
            request.user_id = decoded.get("id")

        except jwt.ExpiredSignatureError:
            return JsonResponse({"message": "Token expired"}, status=401)
        except jwt.InvalidTokenError:
            return JsonResponse({"message": "Invalid token"}, status=401)
        return view_func(request, *args, **kwargs)
    return wrapper