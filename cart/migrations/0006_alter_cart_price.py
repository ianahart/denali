# Generated by Django 4.0.4 on 2022-07-04 17:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cart', '0005_cart_price'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cart',
            name='price',
            field=models.FloatField(blank=True, default=0, null=True),
        ),
    ]
