from django.db import models
from django.conf import settings
from django.utils import timezone

class Todo(models.Model):
	PRIORITY=[
	('h','High'),
	('m','Medium'),
	('l','Low'),
	]
	user=models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name='todos')
	text=models.TextField()
	alarm=models.DateTimeField(blank=True,null=False)
	status=models.BooleanField(default=False)
	created=models.DateTimeField(auto_now_add=True)
	updated=models.DateTimeField(auto_now=True)
	priority=models.CharField(choices=PRIORITY,default='m',max_length=1,null=True)


