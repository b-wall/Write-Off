from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name='index'),
    path("hello/", views.landingpage, name='landing'),
    path("register/", views.register, name='register'),
    path("login/", views.login, name='login'),
    path("characters/", views.characters, name='characters'),
    path("timeline/", views.timeline, name='timeline'),
    path("write/", views.write, name='write'),
    path("practice/", views.practice, name='practice'),
]
