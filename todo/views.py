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
			query=Day.objects.get(Q(date=today)&Q(todo__user=self.request.user))
		except:
			query=None
		return query

	def get_context_data(self,*args,**kwargs):
		context=super().get_context_data(*args,**kwargs)
		context['day_todos']=self.get_queryset()
		return context