# Generated by Django 4.0.2 on 2022-07-18 07:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('writeoff', '0005_alter_timelineitem_title'),
    ]

    operations = [
        migrations.AddField(
            model_name='timelineitem',
            name='position',
            field=models.IntegerField(default=1),
            preserve_default=False,
        ),
    ]