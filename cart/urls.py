from django.urls import path
from cart import views
urlpatterns = [
    path('carts/', views.ListCreateAPIView.as_view()),
    path('carts/<int:pk>/', views.DetailsAPIView.as_view()),
    path('carts/total/', views.CartTotalAPIView.as_view()),
    path('carts/grand-total/', views.CartGrandTotalAPIView.as_view()),
]

