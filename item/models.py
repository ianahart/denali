from typing import Union
from django.core.exceptions import ObjectDoesNotExist
from django.db import models
from datetime import datetime, timedelta, date
from django.core.paginator import EmptyPage, Paginator
from django.db.utils import DatabaseError
from django.utils import timezone
import logging
logger = logging.getLogger('django')


class ItemManager(models.Manager):

    def item(self, item_id: int) -> dict[str, Union[str, 'Item']]:
        """
            Get a specified item
        """
        try:
            obj = Item.objects.get(pk=item_id)
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

    def search(self, data: dict[str, str]):
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
    user = models.ForeignKey(
        'account.CustomUser',
        on_delete=models.CASCADE,
        related_name="user_messages"
    )
