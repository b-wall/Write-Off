# Generated by Django 4.0.2 on 2022-06-28 07:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('writeoff', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='timelineitem',
            name='character_list',
        ),
        migrations.AlterField(
            model_name='character',
            name='Appearance',
            field=models.TextField(blank=True),
        ),
        migrations.AlterField(
            model_name='character',
            name='Other',
            field=models.TextField(blank=True),
        ),
        migrations.AlterField(
            model_name='character',
            name='age',
            field=models.IntegerField(blank=True),
        ),
        migrations.AlterField(
            model_name='character',
            name='personality',
            field=models.TextField(blank=True),
        ),
    ]