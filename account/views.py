from django.shortcuts import render

from django.core.exceptions import BadRequest, ObjectDoesNotExist
from django.db import DatabaseError
from django.contrib.auth.hashers import check_password
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from account.permissions import AccountPermission
from account.models import CustomUser


class RetreiveUserAPIView(APIView):
    permission_classes = [IsAuthenticated, AccountPermission, ]

    def get(self, request):
        try:
            return Response({
                'message': 'success',
            }, status=status.HTTP_200_OK)
        except (BadRequest, ObjectDoesNotExist, ) as e:
            status_code, error = 400, ''

            return Response({
                'errors': str(e)
            }, status=status_code)
