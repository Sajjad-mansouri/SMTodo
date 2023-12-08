from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import get_user_model
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout, Submit, Row, Column
from django import forms  
from .models import UserInfo



class CustomCreationForm(UserCreationForm):
	email=forms.EmailField()
	class Meta(UserCreationForm.Meta):
		model=get_user_model()
		fields=('first_name','last_name','username','email',)
	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		self.fields['username'].help_text=None

		self.fields['password1'].help_text=None
		self.fields['password2'].help_text=None


		self.helper=FormHelper()
		self.helper.form_class='register'
		self.helper.layout=Layout(

			Row(
				Column('username', css_class='form-outline mb-4'),
				)
			,Row(
								Column('email', css_class='form-outline mb-4'),
				),
			Row(
				Column('password1', css_class='form-outline mb-4'),
				),
			Row(
				Column('password2', css_class='form-outline mb-4')),
			Submit('submit', 'Sign Up')
		)

class UserForm(forms.ModelForm):
	class Meta:
		model=get_user_model()
		fields=['first_name','last_name','username','email']

class UserInfoForm(forms.ModelForm):

	class Meta:
		model=UserInfo
		fields=['profile_image']
