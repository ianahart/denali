from rest_framework.exceptions import PermissionDenied, ValidationError
from django.core.exceptions import BadRequest, ObjectDoesNotExist
from django.db import DatabaseError
from django.contrib.auth.hashers import check_password
from rest_framework.decorators import permission_classes
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from account.permissions import AccountPermission
from account.models import CustomUser
from authentication.serializers import RegisterSerializer
import json


class RegisterAPIView(APIView):
    """
       A View for creating/registering a user.
    """
    permission_classes = [AllowAny, ]

    def post(self, request):
        try:
            serializer = RegisterSerializer(data=request.data)
            if not serializer.is_valid():
                return Response({
                    'errors': serializer.errors,
                }, status=status.HTTP_400_BAD_REQUEST)

            serializer.create(serializer.validated_data)

            return Response({
                'message': 'success'
            }, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({
                'errors': {}
            }, status=status.HTTP_400_BAD_REQUEST)
