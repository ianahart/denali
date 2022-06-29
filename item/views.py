from rest_framework.exceptions import ValidationError
from django.core.exceptions import BadRequest
from rest_framework.decorators import permission_classes
from rest_framework.views import APIView
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from item.serializers import CreateItemSerializer, FileSerializer
from item.services.simplestorage import SimpleStorage
from item.models import Item
import json
import logging
logger = logging.getLogger('django')


class AdminListCreateAPIView(APIView):
    """
       A View for creating an item.
    """
    permission_classes = [IsAuthenticated, IsAdminUser, ]

    def post(self, request):
        try:
            data = json.loads(request.data['form'])

            form_serializer = CreateItemSerializer(
                data=json.loads(request.data['form']))
            file_serializer = FileSerializer(data=request.data)

            response = {}

            if not form_serializer.is_valid():
                response['errors'] = form_serializer.errors

            if not file_serializer.is_valid():
                response['file'] = file_serializer.errors

            if len(response) > 0:
                return Response(response, status=status.HTTP_400_BAD_REQUEST)

            if not file_serializer.validated_data:
                raise BadRequest

            simple_storage = SimpleStorage(
                file_serializer.validated_data['file'], 'items')

            result = simple_storage.upload_file()

            result = Item.objects.create(
                file_data=result, data=form_serializer.validated_data)

            if result['type'] == 'error':
                raise BadRequest(result['msg'])

            return Response({
                'message': 'success'
            }, status=status.HTTP_200_OK)
        except (BadRequest, ) as e:
            print(e)
            return Response({
                'errors': dict(name=[str(e)])},
                status=status.HTTP_400_BAD_REQUEST)
