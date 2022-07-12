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
from account.serializers import UserSerializer


class DetailsAPIView(APIView):
    permission_classes = [IsAuthenticated, ]

    def delete(self, request, pk=None):
        try:

            email = request.query_params['email']
            user = CustomUser.objects.all().filter(email=email).first()

            if user is None:
                raise ObjectDoesNotExist('User does not exist.')

            if user.id != id:
                raise BadRequest(
                    'You do not have permission to delete this account.')

            user.delete()

            return Response({
                'message': 'success'
            }, status=status.HTTP_200_OK)

        except ObjectDoesNotExist as e:
            return Response({
                'errors': str(e)}, status=status.HTTP_404_NOT_FOUND)


class RetreiveUserAPIView(APIView):
    permission_classes = [IsAuthenticated, ]

    def get(self, request):
        try:
            user = CustomUser.objects.user_by_token(
                request.user,
                request.headers['authorization'])
            serializer = UserSerializer(user)
            return Response({
                'message': 'success',
                'user': serializer.data
            }, status=status.HTTP_200_OK)
        except BadRequest as e:
            return Response({
                            'errors': 'Something went wrong.'
                            }, status=status.HTTP_400_BAD_REQUEST)
