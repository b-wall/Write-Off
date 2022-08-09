# Generated by Django 4.0.2 on 2022-07-19 03:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('writeoff', '0008_order'),
    ]

    operations = [
        migrations.AddField(
            model_name='timelineitem',
            name='beginningOrder',
            field=models.PositiveIntegerField(default=1),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='timelineitem',
            name='endOrder',
            field=models.PositiveIntegerField(default=1),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='timelineitem',
            name='middleOrder',
            field=models.PositiveIntegerField(default=1),
            preserve_default=False,
        ),
        migrations.DeleteModel(
            name='Order',
        ),
    ]