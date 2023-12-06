from django.urls import path
from . import views

urlpatterns=[
	path('',views.TodoAPIList.as_view(),name='todo-list'),
	path('<str:date>',views.TodoAPIList.as_view(),name='todo-list'),
	path('todo/<int:pk>',views.TodoAPIDetail.as_view(),name='todo-detail'),
	path('profile/<int:pk>',views.UserAPIView.as_view(),name='user')

]