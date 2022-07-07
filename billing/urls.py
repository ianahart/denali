from django.urls import path
from billing import views
urlpatterns = [
    path('billing/', views.ListCreateAPIView.as_view()),
]
