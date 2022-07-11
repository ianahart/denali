from rest_framework import serializers

from review.models import Review


class ReviewSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()

    class Meta:
        model = Review
        fields = ( 'id','rating', 'user', 'item', 'text',
                  'first_name', 'last_name', 'created_at',)


class CreateReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ('rating', 'user', 'item', 'text', )
