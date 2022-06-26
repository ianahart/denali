from rest_framework import serializers

from account.models import CustomUser


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

    def validate_first_name(self, first_name):
        if len(first_name) == 0:
            raise serializers.ValidationError('First name cannot be empty.')
        return first_name

    def validate_last_name(self, last_name):
        if len(last_name) == 0:
            raise serializers.ValidationError('Last name cannot be empty.')
        return last_name

    def validate_email(self, email):
        if len(email) == 0:
            raise serializers.ValidationError('email cannot be empty.')
        return email

    def validate_password(self, password):
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
