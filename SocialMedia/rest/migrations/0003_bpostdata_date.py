# Generated by Django 5.0.2 on 2024-04-06 20:53

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rest', '0002_alter_bpostdata_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='bpostdata',
            name='date',
            field=models.DateField(default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
