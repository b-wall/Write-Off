from django.db import IntegrityError, transaction
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from writeoff.models import Project, Character, Genre, TimelineItem
from .serializers import ProjectSerializer, CharacterSerializer, TimelineItemSerializer
from django.utils.text import slugify
from writeoff.utils import order
import random


# Project Model API

@api_view(['GET'])
def getProjects(request):
    data = {}
    try:
        projects = Project.objects.filter(author=request.user)
    except Project.DoesNotExist:
        data['info'] = 'no projects found'
        return Response(data=data)
    serializer = ProjectSerializer(projects, many=True)
    return Response(serializer.data)


@api_view(['PUT'])
def editProject(request, slug):
    try:
        project = Project.objects.get(slug=slug)
    except Project.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = ProjectSerializer(
        instance=project, data=request.data, partial=True)
    data = {}
    if serializer.is_valid():
        genreName = Genre.objects.get(id=request.data['genre'])
        try:
            serializer._validated_data['slug'] = slugify(
                request.data['title'])
            serializer.save()
            data["base"] = serializer.data
            data["genre"] = genreName.name
            return Response(data=data)
        except IntegrityError:
            slug = slugify(request.data['title'])
            qs = Project.objects.filter(slug=slug).exclude(id=project.id)
            if qs.exists():
                randInt = random.randint(200_000, 500_000)
                slug = f"{slug}-{randInt}"
                serializer._validated_data['slug'] = slug
                serializer.save()
                return Response({'success': 'slug existed, but was changed to a unique value.'})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def deleteProject(request, slug):
    try:
        project = Project.objects.get(slug=slug)
    except Project.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    process = project.delete()
    data = {}
    if process:
        data["success"] = "project deleted"
    else:
        data["failure"] = "delete failed"

    return Response(data=data)

# Character Model API


@api_view(['GET'])
def getCharacters(request, slug):
    try:
        project = Project.objects.get(slug=slug)
    except Project.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    characters = Character.objects.filter(project=project)
    serializer = CharacterSerializer(characters, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def createCharacter(request):
    serializer = CharacterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)


# Timeline Model API

@api_view(['GET'])
def getTimelineItems(request, slug, cid):
    try:
        project = Project.objects.get(slug=slug)
    except Project.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if cid == 1:
        timelineItems = TimelineItem.objects.filter(
            project=project).filter(columnId=cid).order_by('beginningOrder')
    elif cid == 2:
        timelineItems = TimelineItem.objects.filter(
            project=project).filter(columnId=cid).order_by('middleOrder')
    else:
        timelineItems = TimelineItem.objects.filter(
            project=project).filter(columnId=cid).order_by('endOrder')
    serializer = TimelineItemSerializer(timelineItems, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getTimelineItem(request, slug, id):
    try:
        project = Project.objects.get(slug=slug)
    except Project.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    timelineItem = TimelineItem.objects.filter(
        project=project).filter(pk=id)[0]
    serializer = TimelineItemSerializer(timelineItem)
    return Response(serializer.data)


@api_view(['PUT'])
def updateTimelineItem(request, slug, id):
    try:
        project = Project.objects.get(slug=slug)
    except Project.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    timelineItem = TimelineItem.objects.filter(
        project=project).filter(pk=id)[0]
    serializer = TimelineItemSerializer(
        instance=timelineItem, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    try:
        cid = serializer.initial_data['columnId']
        orderedIds = serializer.initial_data['items'].split(',')
        with transaction.atomic():
            currentOrder = 1
            for orderedId in orderedIds:
                object = TimelineItem.objects.get(pk=orderedId)
                order(cid,
                      object, currentOrder)
                currentOrder += 1
            data = {}
            data['success'] = 'Changed order'
            return Response(data=data)
    except KeyError:
        return Response(serializer.data)


@api_view(['POST'])
def createTimelineItem(request, slug):
    try:
        project = Project.objects.get(slug=slug)
    except Project.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    timelineItem = TimelineItem(project=project)

    serializer = TimelineItemSerializer(timelineItem, data=request.data)
    if serializer.initial_data['position']:
        cid = serializer.initial_data['columnId']
        timelineCount = TimelineItem.objects.filter(
            project=project).filter(columnId=cid).count()
        if cid == '1':
            serializer.initial_data['beginningOrder'] = int(timelineCount + 1)
        elif cid == '2':
            serializer.initial_data['middleOrder'] = int(timelineCount + 1)
        else:
            serializer.initial_data['endOrder'] = int(timelineCount + 1)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def deleteTimelineItem(request, slug, id):
    data = {}
    try:
        project = Project.objects.get(slug=slug)
    except Project.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    timelineItem = TimelineItem.objects.filter(
        project=project).filter(pk=id)[0]
    process = timelineItem.delete()
    if process:
        data['success'] = 'Timeline Item deleted'
    else:
        data['failure'] = 'Timeline Item failed to delete'

    return Response(data=data)
