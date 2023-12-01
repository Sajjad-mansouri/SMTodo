from todo.models import Todo

class OwnerMixin:
	def get_queryset(self):
		return Todo.objects.filter(user=self.request.user) 
	def perform_create(self, serializer):
		serializer.save(user=self.request.user)