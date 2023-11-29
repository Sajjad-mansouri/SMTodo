from django.views.generic import TemplateView

class Index(TemplateView):
	template_name='index.html'

	def get(self, request, *args, **kwargs):
		if request.user.is_authenticated:
			return HttpResponseRedirect(reverse('rooms'))
		else:
			return super().get(request,*args,**kwargs)


class ToDo(TemplateView):
	template_name='todo/todo.html'