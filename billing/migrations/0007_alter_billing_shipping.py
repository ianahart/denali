# Generated by Django 4.0.4 on 2022-07-10 15:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('billing', '0006_billing_customer_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='billing',
            name='shipping',
            field=models.IntegerField(),
        ),
    ]
