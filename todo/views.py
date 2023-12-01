from django.views.generic import TemplateView,CreateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import HttpResponseRedirect
from django.urls import reverse
from .models import Todo
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
		user=self.request.user
		query=Todo.objects.filter(user=self.request.user)
		return query

	def form_valid(self,form):
		self.object=form.save(commit=False)
		self.object.user=self.request.user
		self.object.save()
		return HttpResponseRedirect(reverse('todo'))

	def get_context_data(self,*args,**kwargs):
		context=super().get_context_data(*args,**kwargs)
		context['todos']=self.get_queryset()
		return context