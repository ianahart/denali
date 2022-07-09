from django.urls import path
from order import views
urlpatterns = [
    path('orders/', views.ListCreateAPIView.as_view()),
]

