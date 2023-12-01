from django import forms
from .models import Todo

class TodoForm(forms.ModelForm):
	class Meta:
		model=Todo
		exclude=['user','status','date']
		widgets = {
            'alarm': forms.DateTimeInput(attrs={'type': 'date'}),
        }
	def __init__(self,*args,**kwargs):
		super().__init__(*args,**kwargs)
		self.fields['text'].widget.attrs.update(style='height:20vh')

		# Create a FormHelper for layout customization using crispy forms

