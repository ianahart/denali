# Generated by Django 4.0.4 on 2022-07-04 16:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('cart', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='cart',
            old_name='quantity',
            new_name='total',
        ),
    ]
