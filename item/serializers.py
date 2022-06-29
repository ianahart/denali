from item.models import Item
from rest_framework import serializers
import re


class CreateItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ('price', 'size', 'description', 'quantity', 'name', 'user', )

    def validate_name(self, name: str):
        if len(name) == 0 or len(name) > 200:
            raise serializers.ValidationError(
                'Name cannot be empty and must be under 200 characters.')
        return name.strip()

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
    file = serializers.ImageField()

    class Meta:
        model = Item
        fields = ('file', )

    def validate_file(self, file):
        if file.size > 1500000:
            raise serializers.ValidationError('Photo must be under 1.5MB.')
        return file
