# Generated by Django 4.0.2 on 2022-06-28 07:33

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('writeoff', '0004_alter_character_age'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='character',
            options={'ordering': ['name']},
        ),
        migrations.AlterModelOptions(
            name='genre',
            options={'ordering': ['name']},
        ),
        migrations.AlterModelOptions(
            name='project',
            options={'ordering': ['-edited']},
        ),
    ]
