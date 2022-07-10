from rest_framework import serializers
import re
from billing.models import Billing


class BillingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Billing
        fields = (
            'state',
            'zip',
            'street_address',
            'street_address_2',
            'city'
        )


class CreateBillingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Billing
        fields = (
            'total',
            'user',
            'city',
            'company',
            'country',
            'first_name',
            'last_name',
            'shipping',
            'shipping_type',
            'phone',
            'state',
            'street_address',
            'street_address_2',
            'zip',
        )

    def validate_phone(self, phone):
        pattern = r'(\+[0-9]+\s*)?(\([0-9]+\))?[\s0-9\-]+[0-9]+'
        matched = re.match(pattern, str(phone))
        if not matched:
            raise serializers.ValidationError(
                'Please enter a proper phone number.')
        return phone
