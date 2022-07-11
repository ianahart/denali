from rest_framework.exceptions import ValidationError
from django.core.exceptions import BadRequest, ObjectDoesNotExist
from rest_framework.decorators import permission_classes
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from account.models import CustomUser
from authentication.models import PasswordReset
from authentication.serializers import PasswordResetSerializer, ForgotPasswordSerializer, RegisterSerializer, LoginSerializer, LogoutSerializer
from account.serializers import UserSerializer
import json
import logging
logger = logging.getLogger('django')


class PasswordResetAPIView(APIView):
    def post(self, request):
        try:
            serializer = PasswordResetSerializer(data=request.data)

            if not serializer.is_valid():
                return Response({
                                'errors': serializer.errors
                                }, status=status.HTTP_400_BAD_REQUEST)

            token, password, _ = serializer.validated_data.values()
            result = PasswordReset.objects.reset_password(token, password)

            if result['type'] == 'error':
                raise BadRequest(result['msg'])

            return Response({
                            'message': 'success'
                            }, status=status.HTTP_200_OK)
        except BadRequest as e:
            print(e)
            return Response({
                'errors': dict(password=([str(e)]))}, status=status.HTTP_400_BAD_REQUEST)


class ForgotPasswordAPIView(APIView):
    def post(self, request):
        try:
            serializer = ForgotPasswordSerializer(data=request.data)
            if not serializer.is_valid():
                return Response({
                                'errors': serializer.errors
                                }, status=status.HTTP_400_BAD_REQUEST)

            result = CustomUser.objects.forgot_password_email(
                serializer.validated_data['email']
            )

            if result['type'] == 'error':
                raise ObjectDoesNotExist(result['msg'])

            PasswordReset.objects.create(result)

            return Response({
                'message': 'success'
            }, status=status.HTTP_200_OK)
        except (Exception, ObjectDoesNotExist, ) as e:
            return Response({
                'errors': str(e)}, status=status.HTTP_404_NOT_FOUND)


class LogoutAPIView(APIView):
    """
        A view for logging a user out.
    """

    permission_classes = [IsAuthenticated, ]

    def post(self, request):
        try:
            serializer = LogoutSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            if serializer.validated_data:
                CustomUser.objects.logout(serializer.validated_data)

            return Response({
                'message': 'success',
            }, status=status.HTTP_200_OK)
        except BadRequest as e:
            logger.error('Unable to sign a user out.')
            print(e)
            return Response({
                            'errors': 'Something went wrong logging out.'
                            }, status=status.HTTP_400_BAD_REQUEST)


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


class TokenObtainPairView(APIView):
    """
        A view for authenticating a user.
    """
    permission_classes = [AllowAny, ]

    def post(self, request):
        try:
            serializer = LoginSerializer(data=request.data)
            if not serializer.is_valid():
                return Response({
                    'errors': serializer.errors,
                }, status=status.HTTP_400_BAD_REQUEST)

            if serializer.validated_data:
                email, password = serializer.validated_data.values()
                result = CustomUser.objects.login(email, password)

                if isinstance(result, dict) and result['type'] == 'error':
                    raise BadRequest(result['msg'])

                user_serializer = UserSerializer(result['user'])
                return Response({
                    'message': 'success',
                    'tokens': result['tokens'],
                    'user': user_serializer.data
                }, status=status.HTTP_200_OK)
        except BadRequest as e:
            return Response({
                'errors': dict(email=[str(e)])
            }, status=status.HTTP_400_BAD_REQUEST)
