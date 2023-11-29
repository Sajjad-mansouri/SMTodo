from django.views.generic import CreateView,UpdateView
from django.contrib.auth import get_user_model
from django.urls import reverse_lazy,reverse
from django.http import HttpResponseRedirect
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.messages.views import SuccessMessageMixin
from .confirmation import EmailConfirmation
from .forms import CustomCreationForm

User_Model=get_user_model()
class Register(CreateView):
	model=get_user_model()
	form_class=CustomCreationForm
	template_name='registration/register.html'
	success_url=reverse_lazy('index')


	def form_valid(self,form):
		self.object=form.save(commit=False)
		self.object.is_active=False
		self.object.save()
		email_conf=EmailConfirmation(email=self.object.email,request=self.request)
		email_conf.save()
		return HttpResponseRedirect(self.get_success_url())





