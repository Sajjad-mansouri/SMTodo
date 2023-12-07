from django.db import models
from django.conf import settings
from django.utils import timezone

class Day(models.Model):
	date=models.DateField(default=timezone.now,unique=True)

	def __str__(self):
		return f'{self.date}'

	class Meta:
		ordering=['-date']

class Todo(models.Model):
	user=models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name='todos')
	text=models.TextField()
	date=models.ForeignKey(Day,on_delete=models.CASCADE)
	status=models.BooleanField(default=False)
	created=models.DateTimeField(auto_now_add=True)
	updated=models.DateTimeField(auto_now=True)
	

	class Meta:
		ordering=['-created']


