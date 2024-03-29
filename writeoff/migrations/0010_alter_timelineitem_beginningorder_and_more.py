# Generated by Django 4.0.2 on 2022-07-19 03:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('writeoff', '0009_timelineitem_beginningorder_timelineitem_endorder_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='timelineitem',
            name='beginningOrder',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='timelineitem',
            name='endOrder',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='timelineitem',
            name='middleOrder',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
    ]
