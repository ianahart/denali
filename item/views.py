from os import walk
from rest_framework.exceptions import ValidationError
from django.core.exceptions import BadRequest, ObjectDoesNotExist
from rest_framework.decorators import permission_classes
from rest_framework.views import APIView
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from item.serializers import DiscountItemSerializer, ItemSerializer, CreateItemSerializer, FileSerializer, SearchSerializer
from item.services.simplestorage import SimpleStorage
from item.models import Item
import json
import logging
logger = logging.getLogger('django')


class ListCreateAPIView(APIView):
    permission_classes = [AllowAny, ]

    def get(self, request):
        try:
            result = Item.objects.inventory(
                request.query_params['page'],
                request.query_params['direction']
            )
            if result['type'] == 'error':
                raise ObjectDoesNotExist('No more items to be loaded.')

            items_serializer = ItemSerializer(result['items'], many=True)

            return Response({
                'message': 'success',
                'items': items_serializer.data,
                'page_range': result['page_range'],
                'has_next': result['has_next'],
                'page': result['page']
            }, status=status.HTTP_200_OK)
        except ObjectDoesNotExist as e:
            return Response({
                'errors': str(e)
            }, status=status.HTTP_404_NOT_FOUND)


class AdminDiscountAPIView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser, ]

    """
        A view for discounting an item
    """

    def patch(self, request, pk: int):
        try:
            serializer = DiscountItemSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            if not serializer.validated_data:
                raise BadRequest('Unable to change discount.')
            discount = Item.objects.change_discount(
                serializer.validated_data['discount'], pk)

            return Response({
                'message': 'success',
                'discount': discount
            }, status=status.HTTP_200_OK)
        except BadRequest as e:
            return Response({
                'errors': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


class AdminSearchAPIView(APIView):
    """
       A view for searching for an item.
    """

    def post(self, request):
        try:
            search_serializer = SearchSerializer(data=request.data)
            search_serializer.is_valid(raise_exception=True)

            if search_serializer.validated_data:
                result = Item.objects.search(search_serializer.validated_data)
                if result['type'] == 'error':
                    raise BadRequest(result['msg'])

                data = ItemSerializer(result['data'])

                return Response({
                                'message': 'success',
                                'item': data.data,
                                }, status=status.HTTP_200_OK)
        except BadRequest as e:
            print(e)
            return Response({
                'search_term': [str(e)],
            }, status=status.HTTP_400_BAD_REQUEST)


class AdminListCreateAPIView(APIView):
    """
       A view for creating an item and retrieving all items.
    """
    permission_classes = [IsAuthenticated, IsAdminUser, ]

    def post(self, request):
        try:

            form_serializer = CreateItemSerializer(
                data=json.loads(request.data['form']))

            response = {}
            result = None
            if 'file' in request.data:
                file_serializer = FileSerializer(
                    data={'file': request.data['file']})

                if not file_serializer.is_valid():
                    response['file'] = file_serializer.errors

                if not file_serializer.validated_data:
                    raise BadRequest
                simple_storage = SimpleStorage(
                    file_serializer.validated_data['file'], 'items')

                result = simple_storage.upload_file()

            if not form_serializer.is_valid():
                response['errors'] = form_serializer.errors

            if len(response) > 0:
                return Response(response, status=status.HTTP_400_BAD_REQUEST)

            result = Item.objects.create(
                file_data=result, data=form_serializer.validated_data)

            if result['type'] == 'error':
                raise BadRequest(result['msg'])

            return Response({
                'message': 'success'
            }, status=status.HTTP_200_OK)
        except (BadRequest, Exception) as e:
            return Response({
                'errors': dict(name=[str(e)])},
                status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        try:
            result = Item.objects.inventory(
                request.query_params['page'],
                request.query_params['direction']
            )
            if result['type'] == 'error':
                raise ObjectDoesNotExist('No more items to be loaded.')

            items_serializer = ItemSerializer(result['items'], many=True)

            return Response({
                'message': 'success',
                'items': items_serializer.data,
                'page_range': result['page_range'],
                'has_next': result['has_next'],
                'page': result['page']
            }, status=status.HTTP_200_OK)
        except ObjectDoesNotExist as e:
            return Response({
                'errors': str(e)
            }, status=status.HTTP_404_NOT_FOUND)


class AdminDetailsAPIView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser, ]

    def get(self, request, pk: int):
        try:
            result = Item.objects.item(item_id=pk)

            if result['type'] == 'error':
                raise ObjectDoesNotExist(result['msg'])

            serializer = ItemSerializer(result['item'])

            return Response({
                'message': 'success',
                'item': serializer.data,
            }, status=status.HTTP_200_OK)
        except ObjectDoesNotExist as e:
            return Response({
                'errors': str(e)
            }, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk: int):
        try:

            simple_storage = SimpleStorage()
            item = Item.objects.get(pk=pk)
            simple_storage.delete_file(item.product_filename)
            item.delete()

            return Response({
                'message': 'success'
            }, status=status.HTTP_200_OK)

        except BadRequest as e:
            return Response({
                'errors': {}
            }, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk: int):
        try:
            form_serializer = CreateItemSerializer(
                data=json.loads(request.data['form']))

            response = {}
            result = None
            if 'file' in request.data:
                file_serializer = FileSerializer(
                    data={'file': request.data['file']})

                if not file_serializer.is_valid():
                    response['file'] = file_serializer.errors

                if not file_serializer.validated_data:
                    raise BadRequest
                simple_storage = SimpleStorage(
                    file_serializer.validated_data['file'], 'items')

                item = Item.objects.get(pk=pk)
                simple_storage.delete_file(item.product_filename)

                result = simple_storage.upload_file()

            if not form_serializer.is_valid():
                response['errors'] = form_serializer.errors

            if len(response) > 0:
                return Response(response, status=status.HTTP_400_BAD_REQUEST)

            result = Item.objects.update(
                file_data=result, data=form_serializer.validated_data, pk=pk)

            if result['type'] == 'error':
                raise BadRequest(result['msg'])

            return Response({
                'message': 'success'
            }, status=status.HTTP_200_OK)

        except BadRequest as e:
            return Response({
                'errors': dict(name=[str(e)])}, status=status.HTTP_400_BAD_REQUEST)
