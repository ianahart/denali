from django.urls import path
from billing import views
urlpatterns = [
    path('stripe/charge/',
         views.StripeCheckoutView.as_view()),

]
