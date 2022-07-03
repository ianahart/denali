from django.urls import path
from search import views
urlpatterns = [
    path('searches/', views.ListCreateAPIView.as_view()),
]
