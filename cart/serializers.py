from rest_framework import serializers

from cart.models import Cart
from item.serializers import ItemSerializer


class CartSerializer(serializers.ModelSerializer):
    item = ItemSerializer()

    class Meta:
        model = Cart
        fields = ('item', 'total', 'price', 'name', 'quantity', 'id',)


class CreateCartSerializer(serializers.ModelSerializer):
    price = serializers.FloatField()

    class Meta:
        model = Cart
        fields = ('user', 'item', 'quantity', 'price', 'name', )


class UpdateQuantitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = ('quantity', )
