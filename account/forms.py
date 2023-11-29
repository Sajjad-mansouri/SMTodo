from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import get_user_model
from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout, Submit, Row, Column
from django import forms  



class CustomCreationForm(UserCreationForm):
	email=forms.EmailField()
	class Meta(UserCreationForm.Meta):
		model=get_user_model()
		fields=('first_name','last_name','username','email',)
	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		self.fields['password1'].help_text=None

		self.helper=FormHelper()
		self.helper.layout=Layout(
			Row(
				Column('first_name', css_class='col-md-6 mb-4'),
				Column('last_name', css_class='col-md-6 mb-4'),
				css_class='row'
			),
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