from rest_framework import serializers
from billing.serializers import BillingSerializer

from order.models import Order


class OrderSerializer(serializers.ModelSerializer):
    zip = serializers.IntegerField()
    state = serializers.CharField()
    city = serializers.CharField()
    street_address = serializers.CharField()
    street_address_2 = serializers.CharField()
    product_url = serializers.CharField()
    name = serializers.CharField()
    item_id = serializers.IntegerField()

    class Meta:
        model = Order
        fields = (
            'item_id',
            'zip',
            'state',
            'city',
            'street_address',
            'street_address_2',
            'product_url',
            'name',
            'total',
            'quantity',
        )
