from django.db import models
from django.utils import timezone


class BillingManager(models.Manager):
    def create(self):
        pass


class Billing(models.Model):

    objects: BillingManager = BillingManager()

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    first_name = models.CharField(max_length=200)
    last_name = models.CharField(max_length=200)
    company = models.CharField(max_length=200, blank=True, null=True)
    country = models.CharField(max_length=200)
    street_address = models.CharField(max_length=200)
    street_address_2 = models.CharField(max_length=200, blank=True, null=True)
    city = models.CharField(max_length=200)
    state = models.CharField(max_length=200)
    zip = models.IntegerField()
    phone = models.CharField(max_length=200)
    card = models.IntegerField()
    total = models.FloatField()
    shipping = models.CharField(max_length=200)
    item = models.ForeignKey(
        'item.Item',
        on_delete=models.CASCADE,
        related_name="item_billing"
    )
    user = models.ForeignKey(
        'account.CustomUser',
        on_delete=models.CASCADE,
        related_name='user_billing'
    )
