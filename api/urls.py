from django.urls import path
from . import views

urlpatterns = [
    path("projects/", views.getProjects),
    path("project/edit/<slug:slug>/", views.editProject),
    path("project/delete/<slug:slug>/", views.deleteProject),
    path("project/timeline/<slug:slug>/<int:cid>/", views.getTimelineItems),
    path("project/timeline/<slug:slug>/item/<int:id>/", views.getTimelineItem),
    path("project/timeline/<slug:slug>/edit/<int:id>/", views.updateTimelineItem),
    path("project/timeline/<slug:slug>/create/", views.createTimelineItem),
    path("project/timeline/<slug:slug>/delete/<int:id>/", views.deleteTimelineItem),
    path("project/timeline/characters/<slug:slug>/<int:id>/",
         views.getTimelineCharacters),
    path("project/timeline/<slug:slug>/edit/detailed/<int:id>/",
         views.updateTimelineItemDetailed),
    path("project/timeline/<slug:slug>/edit/characters/<int:id>/",
         views.handleCharacterSelected),
    path("project/write/<slug:slug>/book/", views.getBook),
    path("project/write/<slug:slug>/book/edit/", views.editBook),
    path("stats/<int:uid>/genres/", views.getGenreStats),
    path("stats/<int:uid>/timelines/", views.getTimelineStats),
    path("stats/<int:uid>/characters/", views.getCharacterStats),
]
