from django.contrib import admin

from .models import User, Genre, Project, Character, TimelineItem


class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'id', 'author', 'slug', 'created', 'edited']
    search_fields = ['id', 'title']


class TimelineItemAdmin(admin.ModelAdmin):
    list_display = ['title', 'id', 'columnId',
                    'beginningOrder', 'middleOrder', 'endOrder']
    search_fields = ['id', 'title']


admin.site.register(User)
admin.site.register(Genre)
admin.site.register(Project, ProjectAdmin)
admin.site.register(Character)
admin.site.register(TimelineItem, TimelineItemAdmin)
