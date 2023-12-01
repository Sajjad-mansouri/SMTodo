from rest_framework import serializers
from todo.models import Todo,Day

class DaySerializer(serializers.ModelSerializer):
    date=serializers.DateField()
    class Meta:
        model=Day
        fields=['date']
class TodoSerializer(serializers.ModelSerializer):
    date=DaySerializer()
    class Meta:
        model = Todo
        exclude = ['created','updated']
        read_only_fields = ['user']

    def create(self,validated_data):
        date=validated_data.pop('date')
        print(date)
        date=Day.objects.get_or_create(date=date['date'])

        todo =Todo.objects.create(**validated_data,date=date[0])
        return todo
