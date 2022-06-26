from django.urls import path
from authentication import views
from rest_framework_simplejwt.views import TokenRefreshView
urlpatterns = [
    path('auth/register/', views.RegisterAPIView.as_view()),
]
