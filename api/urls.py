from django.urls import path
from . import views

urlpatterns = [
    path("projects/", views.getProjects),
    path("project/edit/<slug:slug>/", views.editProject),
    path("project/delete/<slug:slug>/", views.deleteProject),
    path("project/timeline/<slug:slug>/", views.getTimelineItems),
    path("project/timeline/<slug:slug>/<int:id>/", views.getTimelineItem),
    path("project/timeline/<slug:slug>/edit/<int:id>/", views.updateTimelineItem),
    path("project/timeline/<slug:slug>/create/", views.createTimelineItem),
    path("project/timeline/<slug:slug>/delete/<int:id>/", views.deleteTimelineItem),
    path("characters/<slug:slug>/", views.getCharacters),
    path("characters/<slug:slug>/create/", views.createCharacter),
]
