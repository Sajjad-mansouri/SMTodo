from django.contrib import admin
from .models import Todo,Day


@admin.register(Todo)
class ToDoAdmin(admin.ModelAdmin):

	list_filter=['user',]

admin.site.register(Day)