# Generated by Django 4.2.7 on 2023-12-02 12:24

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0002_alter_day_options_alter_todo_options'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='todo',
            options={'ordering': ['-date__date']},
        ),
    ]
