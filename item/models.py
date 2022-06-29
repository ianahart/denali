from django.db import models
from datetime import datetime, timedelta, date
from django.db.utils import DatabaseError
from django.utils import timezone
import logging
logger = logging.getLogger('django')


class ItemManager(models.Manager):

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
