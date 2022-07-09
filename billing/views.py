from cart.models import Cart
from core import settings
from django.core.exceptions import BadRequest
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from billing.serializers import CreateBillingSerializer
from billing.models import Billing
from order.models import Order


import stripe

stripe.api_key = settings.STRIPE_SECRET_KEY


class StripeCheckoutView(APIView):
    permission_classes = [IsAuthenticated, ]

    def post(self, request):
        try:

            serializer = CreateBillingSerializer(data=request.data)
            if not serializer.is_valid():
                return Response({
                    'errors': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)

            if serializer.validated_data:
                billing = Billing.objects.create(serializer.validated_data)

                Order.objects.create(
                    request.user, request.data['cart'], billing)

            total = int(serializer.validated_data['total'])

            checkout_session = stripe.checkout.Session.create(
                line_items=[
                    {
                        'price_data': {
                            'unit_amount': total * 100,
                            'currency': 'usd',
                            'product_data': {
                                'name': 'Test Product'
                            },
                        },
                        'quantity': 1,
                    },



                ],
                payment_method_types=['card', ],
                mode='payment',
                success_url=settings.SITE_URL +
                '/?success=true&session_id={CHECKOUT_SESSION_ID}',
                cancel_url=settings.SITE_URL + '/?canceled=true',
            )

            Cart.objects.empty_cart(request.user.id)
            return Response({
                'session_url': checkout_session.url
            }, status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response(
                {'error': 'Something went wrong when creating stripe checkout session'},
                status=status.HTTP_400_BAD_REQUEST
            )


class ListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated, ]

    def post(self, request):
        try:
            serializer = CreateBillingSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            return Response({
                'message': 'success'
            }, status=status.HTTP_200_OK)

        except BadRequest as e:
            print(e)
            return Response({
                'errors': {}
            }, status=status.HTTP_400_BAD_REQUEST)
