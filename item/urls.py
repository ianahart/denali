from django.urls import path
from item import views
urlpatterns = [
    path('items/', views.ListCreateAPIView.as_view()),
    path('admin/items/', views.AdminListCreateAPIView.as_view()),
    path('admin/items/<int:pk>/', views.AdminDetailsAPIView.as_view()),
    path('admin/items/<int:pk>/discount/',
         views.AdminDiscountAPIView.as_view()),
    path('admin/items/search/', views.AdminSearchAPIView.as_view()),
    path('items/search/', views.SearchAPIView.as_view()),
]
