# Generated by Django 4.0.4 on 2022-07-04 17:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cart', '0004_alter_cart_total'),
    ]

    operations = [
        migrations.AddField(
            model_name='cart',
            name='price',
            field=models.IntegerField(blank=True, default=0, null=True),
        ),
    ]
