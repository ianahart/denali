# Generated by Django 4.0.4 on 2022-07-07 23:04

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('billing', '0003_billing_email'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='billing',
            name='card',
        ),
    ]