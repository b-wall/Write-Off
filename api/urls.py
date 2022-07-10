from django.urls import path
from . import views

urlpatterns = [
    path("projects/", views.getProjects),
    path("characters/", views.getCharacters),
    path("characters/create/", views.createCharacter),
]
