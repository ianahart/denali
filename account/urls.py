from django.urls import path
from account import views
urlpatterns = [
    path('account/', views.RetreiveUserAPIView.as_view()),
    path('account/refresh/', views.RetreiveUserAPIView.as_view()),

]
