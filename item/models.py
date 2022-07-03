from typing import Literal, Union
from django.core.exceptions import ObjectDoesNotExist
from django.db import models
from datetime import datetime, timedelta, date
from django.core.paginator import EmptyPage, Paginator
from django.db.utils import DatabaseError
from django.utils import timezone
import logging
logger = logging.getLogger('django')


class ItemManager(models.Manager):

    def search(self, search_term: str, prev_page: int):
        objects = Item.objects.all().order_by(
            'created_at'
        ).filter(
            name__icontains=search_term)

        p = Paginator(objects, 3)

        next_page = int(prev_page) + 1
        has_next = p.page(next_page).has_next()
        next_page_list = p.page(next_page).object_list

        for item in next_page_list:
            item.exerpt = item.description[0:30] + '...'

        return {
            'type': 'ok',
            'items': next_page_list,
            'has_next': has_next,
            'page': next_page,
        }

    def __discount(self, item: 'Item') -> str | Literal[0]:
        discount_price = float(item.price) - \
            float(item.price) / 100 * item.discount
        formatted = "{:.2f}".format(discount_price)

        return 0 if formatted == item.price else formatted

    def change_discount(self, discount: int, pk: int) -> str | Literal[0]:
        item = Item.objects.get(pk=pk)
        item.discount = discount

        item.save()
        item.refresh_from_db()
        discounted = self.__discount(item)

        return discounted

    def item(self, item_id: int) -> dict[str, Union[str, 'Item']]:
        """
            Get a specified item
        """
        try:
            obj = Item.objects.get(pk=item_id)
            setattr(obj, 'discount_price', self.__discount(obj))

            if obj is None:
                raise ObjectDoesNotExist('Item does not exist')

            return {'type': 'ok', 'item': obj}

        except ObjectDoesNotExist as e:
            return {'type': 'error', 'msg': str(e)}

    def __exists_by_title(self, name: str) -> bool:
        """
            Check for an existing item with the name
        """
        exists = Item.objects.all().filter(name=name).first()
        return True if exists is not None else False

    def create(self, file_data, data):
        """
            Create a new item
        """
        try:

            if file_data is None:
                raise DatabaseError('Please choose a photo for the item.')

            if self.__exists_by_title(name=data['name']):
                raise DatabaseError('A product with this name already exists.')

            item = self.model(
                product_url=file_data['product_url'],
                product_filename=file_data['product_filename'],
                name=data['name'],
                price=data['price'],
                size=data['size'],
                quantity=data['quantity'],
                description=data['description'],
                user=data['user']
            )
            item.save()
            return {'type': 'ok', 'msg': 'success'}
        except DatabaseError as e:
            logger.error('A product with this name already exists')
            return {'type': 'error', 'msg': str(e)}

    def update(self, file_data: Union[dict[str, str], None],
               data, pk: int):
        try:
            item = Item.objects.get(pk=pk)
            for key, value in data.items():
                setattr(item, key, value)

            if file_data is not None:
                item.product_url = file_data['product_url']
                item.product_filename = file_data['product_filename']

            item.save()
            return {'type': 'ok', 'msg': 'success'}

        except DatabaseError as e:
            logger.error('Unable to update item from update form.')
            return {'type': 'error', 'msg': str(e)}

    def admin_search(self, data: dict[str, str]):
        item = Item.objects.all().filter(
            name__iexact=data['search_term']).first()

        if item is None:
            search_term = data['search_term']
            return {'type': 'error', 'msg': f'{search_term} does not exist in the inventory.'}

        return {'type': 'ok', 'data': item}

    def inventory(self, prev_page: int, direction: str):
        """
            Get inventory.
        """
        error = {'type': 'error'}

        objects = Item.objects.order_by('-created_at').all()
        p = Paginator(objects, 3)

        next_page = None
        if direction == 'prev':
            if int(prev_page) - 1 == 0:
                return error
            next_page = int(prev_page) - 1
        else:
            if p.count == int(prev_page):
                return error
            next_page = int(prev_page) + 1

        try:
            next_page_list = p.page(next_page)
        except EmptyPage:
            return error
        page_range = p.get_elided_page_range(
            next_page, on_ends=1, on_each_side=2)

        return {
            'type': 'ok',
            'page_range': list(page_range),
            'has_next': next_page_list.has_next(),
            'items': next_page_list.object_list,
            'page': next_page
        }


class Item(models.Model):

    objects: ItemManager = ItemManager()

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    name = models.CharField(max_length=200)
    product_url = models.URLField()
    product_filename = models.TextField(max_length=500)
    price = models.CharField(max_length=50)
    size = models.CharField(max_length=100)
    quantity = models.IntegerField()
    description = models.TextField(max_length=600)
    discount = models.IntegerField(default=0)
    user = models.ForeignKey(
        'account.CustomUser',
        on_delete=models.CASCADE,
        related_name="user_messages"
    )
