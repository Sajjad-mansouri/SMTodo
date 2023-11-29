# Generated by Django 4.2.7 on 2023-11-29 12:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='todo',
            name='priority',
            field=models.CharField(choices=[('h', 'High'), ('m', 'Medium'), ('l', 'Low')], default='m', max_length=1, null=True),
        ),
    ]
