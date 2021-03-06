from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include(('authentication.urls', 'authentication'))),
    path('api/v1/', include(('account.urls', 'account'))),
    path('api/v1/', include(('item.urls', 'item'))),
    path('api/v1/', include(('search.urls', 'search'))),
    path('api/v1/', include(('cart.urls', 'cart'))),
    path('api/v1/', include(('billing.urls', 'billing'))),
    path('api/v1/', include(('order.urls', 'order'))),
    path('api/v1/', include(('review.urls', 'review'))),
]
