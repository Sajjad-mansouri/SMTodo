from django.urls import path,include
from django.contrib import admin
from . import confirmation
from . import views

urlpatterns=[
path('admin/', admin.site.urls),
path('',include('django.contrib.auth.urls')),
path('profile',views.Profile.as_view(),name='profile'),
path('register/',views.Register.as_view(),name='register'),

path(
        "confirm/<uidb64>/<token>/",
        confirmation.EmailConfirmView.as_view(),
        name="email_confirm",)

]
