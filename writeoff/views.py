from django.db import IntegrityError
from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import Http404

from .forms import ProjectForm, CharacterForm
from .models import Character, User, Project, TimelineItem, Genre


# @login_required
def index(request):
    """Display Project List"""
    if request.method == "POST":
        newProject = ProjectForm(request.POST)
        if newProject.is_valid():
            validProject = newProject.save(commit=False)
            validProject.author = request.user
            validProject.save()
            return HttpResponseRedirect(reverse("index"))

    projects = Project.objects.filter(author=request.user)
    genres = Genre.objects.all()

    for project in projects:
        # Check if project has been completed
        if project.progress() == 100:
            project.completed = True
            project.save()

        if project.completed == True:
            if project.progress() < 100:
                project.completed = False
                project.save()

    return render(request, "index.html", {
        'form': ProjectForm(),
        'projects': projects,
        'genres': genres
    })


def landingpage(request):
    """Display landing page"""
    return render(request, "landing.html")


def overview(request, slug=None):
    """Display Overview Page for Project"""
    project = None
    if slug is not None:
        try:
            project = Project.objects.get(slug=slug)
        except:
            raise Http404

    return render(request, "overview.html", {
        'project': project
    })

# @login_required


def characters(request, slug=None):
    """Display Character Page"""
    if request.method == 'POST':
        project = None
        if slug is not None:
            try:
                project = Project.objects.get(slug=slug)
            except:
                raise Http404
        newCharacter = CharacterForm(request.POST, project=project)
        if newCharacter.is_valid():
            savedCharacter = newCharacter.save(commit=False)
            savedCharacter.project = project
            savedCharacter.save()
            newCharacter.save_m2m()

        return HttpResponseRedirect(reverse("characters", args=[slug]))

    project = None
    if slug is not None:
        try:
            project = Project.objects.get(slug=slug)
            characters = Character.objects.filter(project__slug=slug)
            newCharacterForm = CharacterForm(project=project)
        except:
            raise Http404
    return render(request, "characters.html", {
        'project': project,
        'characters': characters,
        'newCharacterForm': newCharacterForm
    })


def characterDelete(request, slug, id):
    try:
        project = Project.objects.get(slug=slug)
        character = Character.objects.get(pk=id)
    except (Project.DoesNotExist, Character.DoesNotExist):
        raise Http404

    character.delete()
    return HttpResponseRedirect(reverse('characters', args=[slug]))


def characterEdit(request, slug, id):
    if request.method == 'POST':
        try:
            project = Project.objects.get(slug=slug)
            character = Character.objects.get(pk=id)
        except (Project.DoesNotExist, Character.DoesNotExist):
            raise Http404

        form = CharacterForm(request.POST, instance=character, project=project)
        form.save()

        return HttpResponseRedirect(reverse('characters', args=[slug]))

# @login_required


def timeline(request, slug=None):
    """Display Timeline View"""
    project = None
    if slug is not None:
        try:
            project = Project.objects.get(slug=slug)
            timelineItems = TimelineItem.objects.filter(project__slug=slug)
        except:
            raise Http404

    return render(request, "timeline.html", {
        'project': project,
        'timelineItems': timelineItems
    })

# @login_required


def write(request, slug):
    """Display page to write content"""
    project = None
    if slug is not None:
        try:
            project = Project.objects.get(slug=slug)
        except:
            raise Http404

    return render(request, "write.html", {'project': project})

# @login_required


def practice(request):
    """Allow user to practice writing"""
    return render(request, "practice.html", {
    })


def user_profile(request, uname):
    """View user profile page"""
    projects = None
    projectCount = 0
    characterCount = 0
    timelineItemCount = 0
    totalWordCount = 0

    try:
        projects = Project.objects.filter(author=request.user)
        projectCount = Project.objects.filter(author=request.user).count()
        characterCount = Character.objects.filter(project__in=projects).count()
        timelineItemCount = TimelineItem.objects.filter(
            project__in=projects).count()
        for project in projects:
            totalWordCount += len(project.content.split())
    except (Project.DoesNotExist, Character.DoesNotExist, TimelineItem.DoesNotExist):
        projectCount = 0
        characterCount = 0
        timelineItemCount = 0
        totalWordCount = 0
    return render(request, "userprofile.html",
                  {'projectCount': projectCount,
                   'characterCount': characterCount,
                   'timelineItemCount': timelineItemCount,
                   'totalWordCount': totalWordCount
                   })


def stats(request, slug):
    """View project stats"""

    project = Project.objects.get(slug=slug)
    return render(request, "stats.html", {
        'project': project
    })


def register(request):
    """Allow user to register an account"""
    if request.method == "POST":
        username = request.POST['username']
        email = request.POST['email']

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "register.html", {
                "message": "Error: passwords must match"
            })

        # Create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "register.html", {
                "message": "Username unavailable"
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))

    return render(request, "register.html")


def login_view(request):
    """Display login page"""
    if request.method == "POST":

        # Log user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render("login.html", {
                "message": "Invalid username/password"
            })
    return render(request, "login.html")


def logout_view(request):
    """Logout User"""
    logout(request)
    return HttpResponseRedirect(reverse("login"))
