from django.db import models
from django.utils import timezone


class BillingManager(models.Manager):
    def create(self, data, customer_id: str):
        billing = self.model()
        billing.first_name = data['first_name']
        billing.last_name = data['last_name']
        if 'company' in data:
            billing.company = data['company']

        if 'street_address_2' in data:
            billing.street_address_2 = data['street_address_2']
        billing.country = data['country']
        billing.street_address = data['street_address']
        billing.city = data['city']
        billing.state = data['state']
        billing.zip = data['zip']
        billing.phone = data['phone']
        billing.user = data['user']
        billing.total = data['total']
        billing.customer_id = customer_id
        billing.customer_id
        billing.save()

        billing.refresh_from_db()
        return billing


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
    shipping = models.CharField(max_length=200)
    user = models.ForeignKey(
        'account.CustomUser',
        on_delete=models.CASCADE,
        related_name='user_billing'
    )
