from django.contrib import admin

from .models import User, Genre, Project, Character, TimelineItem


class ProjectAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'slug', 'created', 'edited']
    search_fields = ['id', 'title']


admin.site.register(User)
admin.site.register(Genre)
admin.site.register(Project, ProjectAdmin)
admin.site.register(Character)
admin.site.register(TimelineItem)
