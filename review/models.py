import logging
from django.core.paginator import Paginator
from django.db import models
from django.utils import timezone
logger = logging.getLogger('django')


class ReviewManager(models.Manager):

    def __rating_stats(self, reviews: models.QuerySet['Review']):
        if len(reviews) == 0:
            return []

        stats = []
        for i in range(1, 5 + 1):
            count = len(
                [review for review in reviews if review.rating == i])
            stats.append({
                'percent': int(count / len(reviews) * 100),
                'rating': i
            })

        return stats

    def retreive(self, item_id: int, page: int):
        objects = Review.objects.all().order_by('created_at').filter(
            item_id=item_id)

        stats = self.__rating_stats(objects)

        p = Paginator(objects, 2)

        next_page = int(page) + 1
        next_page_list = p.page(next_page).object_list

        for list_item in next_page_list:
            setattr(list_item, 'first_name', list_item.user.first_name)
            setattr(list_item, 'last_name', list_item.user.last_name)
            list_item.created_at = list_item.created_at.strftime('%B %d %Y')

        has_next = p.page(next_page).has_next()

        return {
            'page': next_page,
            'has_next': has_next,
            'reviews': next_page_list,
            'stats': stats,
        }

    def create(self, data):
        if data['rating'] == 0:
            return {'type': 'error', 'msg': 'Please rate this review.'}

        existing_review = Review.objects.all().filter(
            user_id=data['user'].id).filter(
            item_id=data['item'].id).first()

        if existing_review is not None:
            return {'type': 'error', 'msg': 'You already wrote a review for this item.'}

        review = self.model()
        review.rating = data['rating']
        review.text = data['text']
        review.user = data['user']
        review.item = data['item']

        review.save()

        return {'type': 'ok'}


class Review(models.Model):

    objects: ReviewManager = ReviewManager()

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    edited = models.BooleanField(default=False)
    text = models.TextField(max_length=400)
    rating = models.IntegerField()
    user = models.ForeignKey(
        'account.CustomUser',
        on_delete=models.CASCADE,
        related_name='user_review'
    )
    item = models.ForeignKey(
        'item.Item',
        on_delete=models.CASCADE,
        related_name='item_review'
    )
