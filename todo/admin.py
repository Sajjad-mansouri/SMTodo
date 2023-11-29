from django.contrib import admin
from .models import Todo


@admin.register(Todo)
class ToDoAdmin(admin.ModelAdmin):

	list_filter=['priority','user','alarm']