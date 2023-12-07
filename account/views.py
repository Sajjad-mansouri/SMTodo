from django.views.generic import CreateView,UpdateView
from django.contrib.auth import get_user_model
from django.urls import reverse_lazy,reverse
from django.http import HttpResponseRedirect
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.messages.views import SuccessMessageMixin
from .confirmation import EmailConfirmation
from .forms import CustomCreationForm,UserForm,UserInfoForm

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







class Profile(LoginRequiredMixin,SuccessMessageMixin,UpdateView):
	model=User_Model
	template_name='profile/profile.html'
	form_class=UserForm
	success_message = "Profile successfully Updated"
	def get_success_url(self):
		return reverse('profile',args=(self.request.user.pk,))

	def get_object(self,queryset=None):
		return self.request.user
	def get_context_data(self,**kwargs):
		context=super().get_context_data(**kwargs)
		context['user_form']=UserInfoForm(instance=self.get_object().userinfo)
		return context



	def post(self,request,*args,**kwargs):
		user=self.get_object().userinfo
		info_form=UserInfoForm(
			instance=user,
			data= self.request.POST,
			files= self.request.FILES,
			)
		if info_form.is_valid():

			self.inf=info_form.save(commit=False)
			self.inf.usesr=self.request.user
			self.inf.save()
			return super().post(request,*args,**kwargs)
		else:
			return self.form_invalid(info_form)