from item.models import Item
from rest_framework import serializers
import re


class RetreiveSearchSerializer(serializers.ModelSerializer):
    exerpt = serializers.CharField()

    class Meta:
        model = Item
        fields = ('id', 'exerpt', 'product_url', 'name', )


class SearchSerializer(serializers.Serializer):
    search_term = serializers.CharField()
    page = serializers.IntegerField()

    class Meta:
        model = Item
        fields = ('search_term', 'page', )

    def validate_search_term(self, search_term: str):
        if len(search_term.strip()) == 0:
            raise serializers.ValidationError(
                'Please provide an item to search for.')
        if len(search_term.strip()) > 200:
            raise serializers.ValidationError(
                'A search cannot exceed 200 characters.')

        return search_term


class DiscountItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ('discount', )


class ItemSerializer(serializers.ModelSerializer):
    discount_price = serializers.CharField(required=False)

    class Meta:
        model = Item
        fields = ('price',
                  'id',
                  'size',
                  'description',
                  'product_url',
                  'quantity',
                  'name',
                  'discount',
                  'discount_price',
                  )


class AdminSearchSerializer(serializers.Serializer):
    search_term = serializers.CharField()

    class Meta:
        model = Item
        fields = ('search_term', )

    def validate_search_term(self, search_term: str):
        if len(search_term) == 0 or len(search_term) > 200:
            raise serializers.ValidationError(
                'Search term cannot be empty and must be under 200 characters.')
        return search_term.strip()


class CreateItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ('price', 'size', 'description', 'quantity', 'name', 'user', )

    def validate_name(self, name: str):
        if len(name) == 0 or len(name) > 200:
            raise serializers.ValidationError(
                'Name cannot be empty and must be under 200 characters.')
        return name.capitalize().strip()

    def validate_price(self, price: str):
        if len(price) == 0 or len(price) > 50:
            raise serializers.ValidationError(
                'Price cannaot be empty and must be under 50 characters.')

        pattern = r"^[0-9]+(\.[0-9]*)?$"
        matched = re.fullmatch(pattern, price)
        if not matched:
            raise serializers.ValidationError(
                'Price can only contain decimals and numbers.')
        return price.strip()

    def validate_size(self, size: str):
        if len(size) == 0 or len(size) > 100:
            raise serializers.ValidationError(
                'Size cannot be empty and must be under 100 characters.')
        return size.strip()

    def validate_quantity(self, quantity: int):
        if quantity > 1000:
            raise serializers.ValidationError(
                'Field cannot exceed 1000 units.')
        return quantity

    def description(self, description: str):
        if len(description) == 0 or len(description) > 600:
            raise serializers.ValidationError(
                'Field cannot be empty and must be under 600 characters.')
        return description.strip()


class FileSerializer(serializers.Serializer):
    file = serializers.ImageField(required=False)

    class Meta:
        model = Item
        fields = ('file', )

    def validate_file(self, file):
        if file.size > 1500000:
            raise serializers.ValidationError('Photo must be under 1.5MB.')
        return file
