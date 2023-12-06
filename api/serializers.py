from rest_framework import serializers
from todo.models import Todo,Day
from account.models import UserInfo
from django.contrib.auth import get_user_model

UserModel=get_user_model()
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

class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model=UserInfo
        fields=['profile_image']
    def update(self,instance,validated_data):
        print(validated_data)
        return super().update(instance,validated_data)

class UserSerializer(serializers.ModelSerializer):
    userinfo=UserInfoSerializer()
    class Meta:
        model=UserModel
        fields=['first_name','last_name','username','email','userinfo']

    def update(self,instance,validated_data):
        print(validated_data)
        instance.first_name=validated_data.get('first_name',instance.first_name)
        instance.last_name = validated_data.get('last_name',instance.last_name)
        instance.username = validated_data.get('username',instance.username)
        instance.email = validated_data.get('email',instance.email)

        try:
            profile = validated_data.get('userinfo',instance.userinfo.profile_image)
            userinfo=UserInfo.objects.get(user=instance)
            userinfo.profile_image=profile['profile_image']
            userinfo.save()
            instance.userinfo=userinfo
        except Exception as e:
            print(e)
        instance.save()
        return instance
    def to_internal_value(self,data):
        print(data)
        if data.get('profile_image'):
            data={'userinfo':{'profile_image':data['profile_image']}}
        return super().to_internal_value(data)
