from rest_framework.response import Response
from rest_framework.decorators import api_view
from writeoff.models import Project, Character
from .serializers import ProjectSerializer, CharacterSerializer


@api_view(['GET'])
def getProjects(request):
    projects = Project.objects.filter(author=request.user)
    serializer = ProjectSerializer(projects, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def getCharacters(request):
    project = Project.objects.get(slug='lord-of-the-rings')
    characters = Character.objects.filter(project=project)
    serializer = CharacterSerializer(characters, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def createCharacter(request):
    serializer = CharacterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)
