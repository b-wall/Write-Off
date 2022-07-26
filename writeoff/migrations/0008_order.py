# Generated by Django 4.0.2 on 2022-07-19 03:05

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('writeoff', '0007_remove_timelineitem_position'),
    ]

    operations = [
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('position', models.PositiveIntegerField()),
                ('column', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='position', to='writeoff.timelineitem')),
            ],
        ),
    ]
