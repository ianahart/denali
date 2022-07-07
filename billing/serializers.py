from rest_framework import serializers
import re
from billing.models import Billing


class CreateBillingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Billing
        fields = (
            'user',
            'city',
            'company',
            'country',
            'first_name',
            'last_name',
            'phone',
            'state',
            'street_address',
            'street_address_2',
            'zip',
        )

    def validate_zip(self, zip):
        pattern = r"^\d{5}(?:[-\s]\d{4})?$"
        matched = re.match(pattern, str(zip))
        if not matched:
            raise serializers.ValidationError(
                'Please enter a proper zip code.')
        return zip

    def validate_phone(self, phone):
        pattern  = r'(\+[0-9]+\s*)?(\([0-9]+\))?[\s0-9\-]+[0-9]+'
        matched = re.match(pattern, str(phone))
        if not matched:
            raise serializers.ValidationError(
                'Please enter a proper phone number.')
        return phone
