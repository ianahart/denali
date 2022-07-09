from django.urls import path
from billing import views
urlpatterns = [
    path('stripe/create-checkout-session/',
         views.StripeCheckoutView.as_view()),

]
