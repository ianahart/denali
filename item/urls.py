from django.urls import path
from item import views
urlpatterns = [
    path('admin/items/', views.AdminListCreateAPIView.as_view()),

]
