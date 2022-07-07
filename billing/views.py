
from django.core.exceptions import BadRequest
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from billing.serializers import CreateBillingSerializer


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
