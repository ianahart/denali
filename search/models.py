from typing import Union
from django.db import models
from django.db.utils import DatabaseError
from django.utils import timezone
from account.models import CustomUser
from item.models import Item
import logging
logger = logging.getLogger('django')


class SearchManager(models.Manager):

    def latest(self, user_id: int):
        searched_item = {}
        object = Search.objects.all().filter(
            user_id=user_id).latest('created_at')
        searched_item['name'] = object.item.name
        searched_item['size'] = object.item.size
        searched_item['product_url'] = object.item.product_url
        searched_item['id'] = object.item.id
        return searched_item

    def create(self, user: 'CustomUser', data: dict[str, Union['CustomUser', 'Item']]):
        try:
            already_searched = Search.objects.all().filter(
                user_id=data['user']
            ).filter(
                item_id=data['item']).first()

            if already_searched:
                return
        except DatabaseError as e:
            print(e)
            logger.error('Unable to verify if item has already been searched.')

        if user.is_authenticated:
            search = self.model()

            search.user = data['user']
            search.item = data['item']

            search.save()


class Search(models.Model):
    objects: SearchManager = SearchManager()

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    item = models.ForeignKey('item.Item',
                             on_delete=models.CASCADE,
                             related_name="item_searches"
                             )
    user = models.ForeignKey('account.CustomUser',
                             on_delete=models.CASCADE,
                             related_name="user_searches"
                             )
