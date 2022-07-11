import logging
from typing import Union
from django.db import models
from django.contrib.auth import hashers
from django.utils import timezone
from rest_framework_simplejwt.backends import TokenBackend
from account.models import CustomUser
from datetime import datetime, timedelta
logger = logging.getLogger('django')


class PasswordResetManager(models.Manager):
    __one_day = 86400

    def reset_password(self, token: str, password: str) -> dict[str, str]:
        try:

            decoded_token = TokenBackend(
                algorithm='HS256',

            ).decode(token, verify=False)

            reset = PasswordReset.objects.all().filter(token=token).first()
            if reset is None:
                logger.error('Password Reset is missing')
                raise Exception('Something went wrong. please try again.')

            today = int(datetime.today().timestamp())
            if today - decoded_token['iat'] > self.__one_day:
                raise Exception('Reset link has expired.')

            user = CustomUser.objects.get(pk=decoded_token['user_id'])
            if hashers.check_password(password, user.password):
                raise Exception(
                    'Password cannot be the same as last password.')

            user.password = hashers.make_password(password)
            user.save()

            reset.delete()

            return {'type': 'ok', 'msg': ''}
        except Exception as e:
            return {'type': 'error', 'msg': str(e)}

    def create(self, data):
        print(data)
        prev_resets = PasswordReset.objects.all().filter(user_id=data['uid'])
        user = CustomUser.objects.get(pk=data['uid'])

        for prev_reset in prev_resets:
            prev_reset.delete()

        password_reset = self.model(
            token=data['token'],
            user=user
        )
        password_reset.save()


class PasswordReset(models.Model):

    objects: PasswordResetManager = PasswordResetManager()

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    token = models.TextField(max_length=400)
    user = models.ForeignKey('account.CustomUser',
                             on_delete=models.CASCADE, related_name='password_reset')

    def __str__(self):
        return self.token
