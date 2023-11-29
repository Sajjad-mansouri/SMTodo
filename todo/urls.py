from django.urls import path,include
from . import views
urlpatterns=[
path('',views.Index.as_view(),name='index'),
path('todo/',views.ToDo.as_view(),name='todo')

]
