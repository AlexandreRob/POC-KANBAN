# Generated by Django 4.1.7 on 2023-03-30 06:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='tableau',
            name='position_col',
            field=models.IntegerField(unique=True),
        ),
        migrations.AlterField(
            model_name='task',
            name='position_col',
            field=models.IntegerField(unique=True),
        ),
    ]