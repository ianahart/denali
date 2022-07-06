from typing import Union
from django.core.paginator import Paginator
from django.db import models
from django.db.utils import DatabaseError
from django.utils import timezone
import logging
logger = logging.getLogger('django')


class CartManager(models.Manager):

    def update_quantity(self, pk: int, quantity: int):
        cart = Cart.objects.get(pk=pk)
        cart.quantity = quantity
        cart.total = quantity * cart.price
        cart.save()

    def grand_total(self, user_id: int) -> int:
        total = 0
        items = Cart.objects.all().filter(user_id=user_id)
        for item in items:
            discount = item.price - float((item.item.discount / 100 * 100))
            total += discount * item.quantity
        return total + 10

    def total(self, user_id: int) -> int:
        return Cart.objects.all().filter(user_id=user_id).count()

    def get_cart(self, user_id: int, prev_page: int):
        objects = Cart.objects.all().filter(
            user_id=user_id).order_by('created_at')

        p = Paginator(objects, 3)
        page = int(prev_page) + 1
        next_page = p.page(page)
        cart_list = next_page.object_list

        for cart_item in cart_list:
            cart_item.item = cart_item.item
        return {
            'page': page,
            'has_next': next_page.has_next(),
            'cart': cart_list,
        }

    def create(self, data) -> None:
        """
            Add an item to a user's cart.
        """
        if data['quantity'] == 0:
            return

        cart_item = Cart.objects.all().filter(name=data['name']).first()

        if cart_item is not None:
            cart_item.quantity = cart_item.quantity + data['quantity']
            cart_item.total = cart_item.total + \
                (data['quantity'] * data['price'])
            cart_item.save()
            return

        cart = self.model(
            user=data['user'],
            item=data['item'],
            quantity=data['quantity'],
            total=data['price'] * data['quantity'],
            price=data['price'],
            name=data['name']
        )

        cart.save()


class Cart(models.Model):
    objects: CartManager = CartManager()

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    quantity = models.IntegerField(default=0, null=True, blank=True)
    name = models.CharField(max_length=200, blank=True, null=True)
    price = models.FloatField(default=0, null=True, blank=True)
    total = models.FloatField()
    item = models.ForeignKey('item.Item',
                             on_delete=models.CASCADE,
                             related_name="item_cart"
                             )
    user = models.ForeignKey('account.CustomUser',
                             on_delete=models.CASCADE,
                             related_name="user_cart"
                             )
