from django.core.exceptions import BadRequest
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from order.serializers import OrderSerializer
from order.models import Order


class ListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated, ]

    def get(self, request):
        try:
            orders = Order.objects.retreive_orders(
                request.query_params['page'],
                request.query_params['user']
            )

            serializer = OrderSerializer(orders['orders'], many=True)

            return Response({
                'message': 'success',
                'orders': serializer.data,
                'has_next': orders['has_next'],
                'page': orders['page']

            }, status=status.HTTP_200_OK)

        except BadRequest as e:
            return Response({
                'errors': {}
            }, status=status.HTTP_400_BAD_REQUEST)
