# Generated by Django 4.0.4 on 2022-07-07 20:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('billing', '0002_alter_billing_zip'),
    ]

    operations = [
        migrations.AddField(
            model_name='billing',
            name='email',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]
