
from django.core.exceptions import BadRequest, PermissionDenied
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from review.models import Review
from review.serializers import CreateReviewSerializer, ReviewSerializer


class ListCreateAPIView(APIView):
    permission_classes = [AllowAny, ]

    def get(self, request):
        try:

            item_id = request.query_params['item']
            page = request.query_params['page']
            reviews = Review.objects.retreive(item_id=item_id, page=page)
            serializer = ReviewSerializer(reviews['reviews'], many=True)

            return Response({
                'message': 'success',
                'page': reviews['page'],
                'has_next': reviews['has_next'],
                'reviews': serializer.data
            }, status=status.HTTP_200_OK)
        except BadRequest as e:
            return Response({
                'errors': {}
            }, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        try:
            if not request.user.is_authenticated:
                raise PermissionDenied('User is not authorized')

            serializer = CreateReviewSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            result = Review.objects.create(serializer.validated_data)

            if result['type'] == 'error':
                raise BadRequest(result['msg'])

            return Response({
                'message': 'success'
            }, status=status.HTTP_200_OK)

        except BadRequest as e:
            return Response({
                'text': [str(e)]}, status=status.HTTP_400_BAD_REQUEST)
