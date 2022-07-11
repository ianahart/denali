from rest_framework import serializers

from account.models import CustomUser


class PasswordResetSerializer(serializers.Serializer):
    token = serializers.CharField()
    password = serializers.CharField()
    confirm_password = serializers.CharField()

    class Meta:
        fields = ('token', 'password', 'confirm_password', )

    def validate_password(self, value: str):
        password = ''.join([ch for ch in value if ch != ' '])
        uppercase, lowercase, num = False, False, False
        for char in password:
            if char.lower() == char:
                lowercase = True
            if char.upper() == char:
                uppercase = True
            if char.isdigit():
                num = True

        if not all(rule for rule in [uppercase, lowercase, num]):
            raise serializers.ValidationError(
                'Please include 1 upper, 1 lower and 1 number.')

        if len(password) < 6 or len(password) > 200:
            raise serializers.ValidationError(
                'Password must be between 6-200 characters.')
        return password.strip()

    def validate(self, data: dict[str, str]):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError(
                dict(password='Passwords do not match.'))
        return data


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.CharField()

    class Meta:
        fields = ('email', )

    def validate_email(self, email: str):
        if len(email) == 0 or len(email) > 200:
            raise serializers.ValidationError(
                'Email must be between 0-200 characters.')
        return email


class LogoutSerializer(serializers.ModelSerializer):
    refresh_token = serializers.CharField()
    id = serializers.IntegerField()

    class Meta:
        model = CustomUser
        fields = ('id', 'refresh_token', )


class LoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField()

    class Meta:
        fields = ('email', 'password', )

    def validate_email(self, email: str):
        if len(email) == 0:
            raise serializers.ValidationError('Email cannot be empty.')
        return email

    def validate_password(self, password: str):
        if len(password) == 0:
            raise serializers.ValidationError('Password cannot be empty.')
        return password


class RegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField()

    class Meta:
        model = CustomUser
        fields = ('first_name',
                  'last_name',
                  'email',
                  'password',
                  'confirm_password'
                  )

    def validate_first_name(self, first_name: str):
        if len(first_name) == 0:
            raise serializers.ValidationError('First name cannot be empty.')
        return first_name.capitalize()

    def validate_last_name(self, last_name: str):
        if len(last_name) == 0:
            raise serializers.ValidationError('Last name cannot be empty.')
        return last_name.capitalize()

    def validate_email(self, email: str):
        if len(email) == 0:
            raise serializers.ValidationError('email cannot be empty.')
        return email

    def validate_password(self, password: str):
        uppercase, lowercase, num = False, False, False
        for char in password:
            if char.lower() == char:
                lowercase = True
            if char.upper() == char:
                uppercase = True
            if char.isdigit():
                num = True

        if not all(rule for rule in [uppercase, lowercase, num]):
            raise serializers.ValidationError(
                'Please include 1 upper, 1 lower and 1 number.')
        return password

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError(
                dict(password=['Passwords do not match.'])
            )
        return data

    def create(self, validated_data):
        creds = ['email', 'password', 'confirm_password']
        email = validated_data['email']
        password = validated_data['password']
        fields = {key: value for key,
                  value in validated_data.items() if key not in creds}
        CustomUser.objects.create(email, password, **fields)
