# Generated by Django 4.2.7 on 2023-11-29 17:30

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0004_alter_todo_alarm'),
    ]

    operations = [
        migrations.AlterField(
            model_name='todo',
            name='alarm',
            field=models.DateField(default=django.utils.timezone.now),
        ),
    ]
