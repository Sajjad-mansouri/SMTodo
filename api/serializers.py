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

    def update(self,instance,validated_data):
        instance.status=validated_data.get('status',instance.status)
        instance.text = validated_data.get('text',instance.text)
        instance.priority = validated_data.get('priority',instance.priority)
        try:
            date = validated_data.get('date',instance.date)
            dateInstance=Day.objects.get_or_create(date=date['date'])
            instance.date=dateInstance[0]
        except:
            instance.date=date
        instance.save()
        return instance
