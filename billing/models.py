from django.db import models
from django.utils import timezone
from django.template.loader import render_to_string
from django.core.mail import EmailMessage
import logging
from core import settings

from account.models import CustomUser
logger = logging.getLogger('django')


class BillingManager(models.Manager):
    def create(self, data, customer_id: str):
        billing = self.model()
        billing.first_name = data['first_name']
        billing.last_name = data['last_name']
        if 'company' in data:
            billing.company = data['company']

        if 'street_address_2' in data:
            billing.street_address_2 = data['street_address_2']
            billing.shipping_type = data['shipping_type']
        billing.country = data['country']
        billing.street_address = data['street_address']
        billing.city = data['city']
        billing.state = data['state']
        billing.zip = data['zip']
        billing.shipping = data['shipping']
        billing.phone = data['phone']
        billing.user = data['user']
        billing.total = data['total']
        billing.customer_id = customer_id
        billing.customer_id
        billing.save()

        billing.refresh_from_db()
        return billing

    def send_confirmation_email(self, cart, user_id: int, shipping_type, shipping):
        user = CustomUser.objects.get(pk=user_id)
        cart_items = []
        total = 0
        for cart_item in cart:
            cart_items.append({
                              'name': cart_item['item']['name'],
                              'product_url': cart_item['item']['product_url'],
                              'quantity': cart_item['quantity'],
                              'total': cart_item['total']
                              })
            total += cart_item['total']
        context = {
            'email': user.email,
            'cart_items': cart_items,
            'shipping_type': shipping_type,
            'grand_total': total + (int(shipping) / 100)
        }
        message = render_to_string('order_confirmation.html', context)

        mail = EmailMessage(
            subject='Order Confirmation:',
            body=message,
            from_email=settings.EMAIL_SENDER,
            to=[user.email]
        )

        mail.content_subtype = 'html'
        mail.send()


class Billing(models.Model):

    objects: BillingManager = BillingManager()

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    first_name = models.CharField(max_length=200)
    customer_id = models.CharField(blank=True, null=True, max_length=200)
    last_name = models.CharField(max_length=200)
    company = models.CharField(max_length=200, blank=True, null=True)
    country = models.CharField(max_length=200)
    street_address = models.CharField(max_length=200)
    street_address_2 = models.CharField(max_length=200, blank=True, null=True)
    city = models.CharField(max_length=200)
    state = models.CharField(max_length=200)
    zip = models.IntegerField()
    phone = models.CharField(max_length=200)
    email = models.CharField(max_length=200, blank=True, null=True)
    total = models.FloatField()
    shipping = models.IntegerField()
    shipping_type = models.CharField(
        max_length=200, default="Standard Shipping 5-10 days")
    user = models.ForeignKey(
        'account.CustomUser',
        on_delete=models.CASCADE,
        related_name='user_billing'
    )
