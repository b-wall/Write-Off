from rest_framework import serializers
from writeoff.models import Project, Character, TimelineItem


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'


class CharacterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Character
        fields = '__all__'


class TimelineItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = TimelineItem
        fields = 'project', 'id', 'title', 'columnId', 'content', 'time', 'completed', 'beginningOrder', 'middleOrder', 'endOrder', 'characters'
        extra_kwargs = {'project': {'required': False}}
        depth = 1
