# Generated by Django 4.0.4 on 2022-07-04 16:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cart', '0002_rename_quantity_cart_total'),
    ]

    operations = [
        migrations.AddField(
            model_name='cart',
            name='quantity',
            field=models.IntegerField(blank=True, default=0, null=True),
        ),
    ]
