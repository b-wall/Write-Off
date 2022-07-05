from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name='index'),
    path("hello/", views.landingpage, name='landing'),
    path("register/", views.register, name='register'),
    path("login/", views.login_view, name='login'),
    path("logout/", views.logout_view, name='logout'),
    path("overview/<str:id>/", views.overview, name='overview'),
    path("characters/<str:id>/", views.characters, name='characters'),
    path("timeline/<str:id>/", views.timeline, name='timeline'),
    path("write/<str:id>/", views.write, name='write'),
    path("practice/", views.practice, name='practice'),
    path("user/<str:uid>", views.user_profile, name='profile'),
    path("stats/<str:id>", views.stats, name='stats'),
]
