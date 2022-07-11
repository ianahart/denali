from django.urls import path
from review import views
urlpatterns = [
    path('reviews/', views.ListCreateAPIView.as_view()),
]
