import jwt
import logging
from typing import Union
from core import settings
from django.core.mail import EmailMessage
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from django.template.loader import render_to_string
from django.contrib.auth import hashers
from django.db import models, DatabaseError
from rest_framework_simplejwt.backends import TokenBackend
from django.contrib.auth.models import BaseUserManager, AbstractUser, PermissionsMixin
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from django.core.exceptions import ObjectDoesNotExist
from datetime import datetime, timedelta, date

logger = logging.getLogger('django')


class CustomUserManager(BaseUserManager):

    def forgot_password_email(self, email: str):
        user = CustomUser.objects.all().filter(email=email).first()

        if user is None:
            return {
                'type': 'error',
                'msg': 'A user with this email does not exist.'
            }

        token = str(RefreshToken.for_user(user))

        cxt = {'token': token, 'email': user.email}
        message = render_to_string('forgot-password.html', cxt)

        mail = EmailMessage(
            subject='Password Reset:',
            body=message,
            from_email=settings.EMAIL_SENDER,
            to=[user.email]
        )
        mail.content_subtype = 'html'
        mail.send()

        return {'type': 'ok',
                'uid': user.id,
                'token': token
        }





    def logout(self, data: dict[str, str | int]):
        pk, refresh_token = data.values()

        user = CustomUser.objects.get(pk=pk)
        user.logged_in = False
        user.save()

        token = RefreshToken(refresh_token)
        token.blacklist()

    def user_by_token(self, user: 'CustomUser', token: str):
        """
            Get the user by header token.
        """
        decoded_token = None
        try:
            decoded_token = TokenBackend(
                algorithm='HS256'
            ).decode(token.split('Bearer ')[1], verify=False)

        except IndexError:
            logger.error('Malformed token inside get user by token')

        if decoded_token is not None:
            obj = CustomUser.objects.get(pk=decoded_token['user_id'])
            return None if obj.pk != user.pk else obj

    def create(self, email: str, password: str, **extra_fields):
        """
        Create and save a User with the given email and password.
        """
        if not email:
            raise ValueError(_('The Email must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email, password=password, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email: str, password: str, **extra_fields):
        """
        Create and save a SuperUser with the given email and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))
        return self.create(email, password, **extra_fields)

    def __user_exists(self, email: str) -> Union['CustomUser', None]:
        return CustomUser.objects.all().filter(email=email).first()

    def login(self, email: str, password: str):
        user = self.__user_exists(email)
        if user is None:
            return {'type': 'error', 'msg': 'A user with that email does not exist.'}

        if not hashers.check_password(password, user.password):
            return {'type': 'error', 'msg': 'Invalid credentials.'}

        user.logged_in = True
        user.save()

        user.refresh_from_db()

        refresh_token = RefreshToken.for_user(user)
        access_token = refresh_token.access_token
        access_token.set_exp(lifetime=timedelta(days=3))

        tokens = {
            'access_token': str(access_token),
            'refresh_token': str(refresh_token)
        }
        return {'type': 'ok', 'tokens': tokens, 'user': user}


class CustomUser(AbstractUser, PermissionsMixin):
    username = None
    logged_in = models.BooleanField(default=False)
    avatar_file = models.TextField(max_length=500, blank=True, null=True)
    avatar_url = models.URLField(max_length=500, blank=True, null=True)
    password_strength = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    name = models.CharField(unique=True, max_length=200, blank=True, null=True)
    first_name = models.CharField(max_length=200, blank=True, null=True)
    last_name = models.CharField(max_length=200, blank=True, null=True)
    email = models.EmailField(_(
        'email address'),
        unique=True,
        blank=True,
        null=True,
        error_messages={'unique':
                        'A user with this email already exists.'
                        }
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects: CustomUserManager = CustomUserManager()

    def __str__(self):
        return f"{self.email}"
