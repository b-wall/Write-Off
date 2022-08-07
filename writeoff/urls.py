from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name='index'),
    path("hello/", views.landingpage, name='landing'),
    path("register/", views.register, name='register'),
    path("login/", views.login_view, name='login'),
    path("logout/", views.logout_view, name='logout'),
    path("overview/<slug:slug>/", views.overview, name='overview'),
    path("characters/<slug:slug>/", views.characters, name='characters'),
    path("characters/<slug:slug>/delete/<int:id>/",
         views.characterDelete, name='characterDelete'),
    path("characters/<slug:slug>/edit/<int:id>/",
         views.characterEdit, name='characterEdit'),
    path("timeline/<slug:slug>/", views.timeline, name='timeline'),
    path("write/<slug:slug>/", views.write, name='write'),
    path("practice/", views.practice, name='practice'),
    path("user/<str:uname>/", views.user_profile, name='profile'),
    path("stats/<slug:slug>/", views.stats, name='stats'),
]
