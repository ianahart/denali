from django.shortcuts import render

from django.core.exceptions import BadRequest, ObjectDoesNotExist
from django.db import DatabaseError
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from cart.serializers import CreateCartSerializer, CartSerializer, UpdateQuantitySerializer
from cart.models import Cart
from item.models import Item


class DetailsAPIView(APIView):
    permission_classes = [IsAuthenticated, ]

    def delete(self, request, pk: int):
        try:

            cart_item = Cart.objects.get(pk=pk)
            cart_item.delete()
            grand_total = Cart.objects.grand_total(request.user.id)

            return Response({
                'message': 'success',
                'grand_total': grand_total
            })
        except BadRequest:
            return Response({
                'errors': {}
            }, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk: int):
        try:

            serializer = UpdateQuantitySerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            if serializer.validated_data:
                Cart.objects.update_quantity(
                    pk, serializer.validated_data['quantity'])

                grand_total = Cart.objects.grand_total(request.user.id)

                return Response({
                    'message': 'success',
                    'grand_total': grand_total
                })
        except BadRequest:
            return Response({
                'errors': {}
            }, status=status.HTTP_400_BAD_REQUEST)


class CartGrandTotalAPIView(APIView):
    def get(self, request):
        try:

            if request.user.is_authenticated and not request.user.is_superuser:
                total = Cart.objects.grand_total(request.user.id)
                return Response({
                    'message': 'success',
                    'total': total
                }, status=status.HTTP_200_OK)
            else:

                return Response({
                    'message': 'success',
                }, status=status.HTTP_200_OK)

        except BadRequest:
            return Response({
                'errors': {}
            }, status=status.HTTP_400_BAD_REQUEST)


class CartTotalAPIView(APIView):
    def get(self, request):
        try:

            if request.user.is_authenticated and not request.user.is_superuser:
                total = Cart.objects.total(request.user.id)
                return Response({
                    'message': 'success',
                    'total': total
                })
            else:
                return Response({
                    'message': 'success',
                }, status=status.HTTP_200_OK)

        except BadRequest:
            return Response({
                'errors': {}
            }, status=status.HTTP_400_BAD_REQUEST)


class ListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated, ]

    def get(self, request):
        try:
            cart = Cart.objects.get_cart(request.query_params['user'],
                                         request.query_params['page'])

            serializer = CartSerializer(cart['cart'], many=True)

            return Response({
                'message': 'success',
                'cart': serializer.data,
                'page': cart['page'],
                'has_next': cart['has_next'],

            }, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response({
                'errors': {}
            }, status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        try:
            serializer = CreateCartSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            Cart.objects.create(serializer.validated_data)
            Item.objects.update_quantity(serializer.validated_data['quantity'],
                                         serializer.validated_data['item'].id)
            return Response({
                'message': 'success'
            }, status=status.HTTP_200_OK)

        except BadRequest as e:
            print(e)
            return Response({
                'errors': {}
            }, status=status.HTTP_400_BAD_REQUEST)
