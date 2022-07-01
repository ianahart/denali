from django.urls import path
from item import views
urlpatterns = [
    path('admin/items/', views.AdminListCreateAPIView.as_view()),
    path('admin/items/<int:pk>/', views.AdminDetailsAPIView.as_view()),
    path('admin/items/<int:pk>/discount/',
         views.AdminDiscountAPIView.as_view()),
    path('admin/items/search/', views.AdminSearchAPIView.as_view()),
]
