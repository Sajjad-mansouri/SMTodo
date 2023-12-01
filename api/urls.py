from django.urls import path
from . import views

urlpatterns=[
	path('',views.TodoAPIList.as_view(),name='todo-list'),
	path('<str:date>',views.TodoAPIList.as_view(),name='todo-list'),

	path('<int:pk>',views.TodoAPIDetail.as_view(),name='todo-detail')

]