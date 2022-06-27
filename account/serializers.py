from rest_framework import serializers

from account.models import CustomUser


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('logged_in', 'id', 'is_superuser', 'first_name', 'last_name', 'email', )
