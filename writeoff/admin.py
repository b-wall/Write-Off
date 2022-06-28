from django.contrib import admin

from .models import User, Genre, Project, Character, TimelineItem

admin.site.register(User)
admin.site.register(Genre)
admin.site.register(Project)
admin.site.register(Character)
admin.site.register(TimelineItem)
