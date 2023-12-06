from django.db import models
from django.contrib.auth.models import AbstractUser

class MyUser(AbstractUser):
	email=models.EmailField(max_length=200,unique=True)

class UserInfo(models.Model):
	user=models.OneToOneField(MyUser,on_delete=models.CASCADE)
	profile_image=models.ImageField(upload_to='profile_image/%Y/',null=True,blank=True)