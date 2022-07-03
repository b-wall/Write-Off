from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name='index'),
    path("hello/", views.landingpage, name='landing'),
    path("register/", views.register, name='register'),
    path("login/", views.login_view, name='login'),
    path("logout/", views.logout_view, name='logout'),
    path("characters/", views.characters, name='characters'),
    path("timeline/", views.timeline, name='timeline'),
    path("write/", views.write, name='write'),
    path("practice/", views.practice, name='practice'),
    path("register/", views.register, name='register'),
]
