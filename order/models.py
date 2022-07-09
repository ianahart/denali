from django.db import models
from django.utils import timezone
from account.models import CustomUser
from django.core.paginator import Paginator


class OrderManager(models.Manager):

    def retreive_orders(self, page: int, user_id: int):
        objects = Order.objects.all().order_by('id').filter(user_id=user_id)

        p = Paginator(objects, 2)

        next_page = int(page) + 1
        next_page_list = p.page(next_page)
        orders = next_page_list.object_list

        for order in orders:
            order.zip = order.billing.zip
            order.state = order.billing.state
            order.city = order.billing.city
            order.street_address = order.billing.street_address
            order.street_address_2 = order.billing.street_address_2
            order.product_url = order.item.product_url
            order.name = order.item.name,
            order.name = order.name[0]
            order.item_id = order.item.id

        return {
            'orders': next_page_list.object_list,
            'has_next': next_page_list.has_next(),
            'page': next_page,
        }

    def create(self, user: 'CustomUser', data, billing):
        for item in data:
            order = self.model()
            order.total = item['total']
            order.quantity = item['quantity']
            order.user_id = user.id  # type:ignore
            order.item_id = item['item']['id']
            order.billing_id = billing.id
            order.save()


class Order(models.Model):

    objects: OrderManager = OrderManager()

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    total = models.FloatField()
    quantity = models.IntegerField()
    billing = models.ForeignKey(
        'billing.Billing',
        on_delete=models.CASCADE,
        related_name='billing_order',
        blank=True,
        null=True,
    )
    item = models.ForeignKey(
        'item.Item',
        on_delete=models.CASCADE,
        related_name='item_order'
    )
    user = models.ForeignKey(
        'account.CustomUser',
        on_delete=models.CASCADE,
        related_name='user_order'
    )
