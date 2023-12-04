from django.views.generic import TemplateView,CreateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.utils import timezone
from django.db.models import Q
from .models import Todo,Day
from .forms import TodoForm

class Index(TemplateView):
	template_name='index.html'

	def get(self, request, *args, **kwargs):
		if request.user.is_authenticated:
			return HttpResponseRedirect(reverse('todo'))
		else:
			return super().get(request,*args,**kwargs)


class ToDo(LoginRequiredMixin,CreateView):
	template_name='todo/todo.html'
	form_class=TodoForm
	def get_queryset(self):
		today=timezone.now().date()
		user=self.request.user
		try:
			todos=Todo.objects.filter(Q(user=self.request.user)& Q(date__date=today))
		except :

			todos=None
		return todos

	def get_context_data(self,*args,**kwargs):
		context=super().get_context_data(*args,**kwargs)
		context['todos']=self.get_queryset().filter(status=False)
		context['finished']=self.get_queryset().filter(status=True)

		context['day']=timezone.now().date()
		return context