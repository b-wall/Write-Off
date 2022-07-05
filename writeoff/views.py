from django.db import IntegrityError
from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required

from .forms import BookForm, ProjectForm
from .models import Character, User, Project


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
        'projects': projects
    })


def landingpage(request):
    """Display landing page"""
    return render(request, "landing.html")


def overview(request, id):

    project = Project.objects.get(pk=id)

    return render(request, "overview.html", {
        'project': project
    })

# @login_required


def characters(request, id):
    """Display Character Page"""
    project = Project.objects.get(pk=id)
    characters = Character.objects.filter(project__id=id)
    return render(request, "characters.html", {
        'project': project,
        'characters': characters
    })

# @login_required


def timeline(request, id):
    """Display Timeline View"""
    project = Project.objects.get(pk=id)
    return render(request, "timeline.html", {
        'project': project
    })

# @login_required


def write(request, id):
    """Display page to write content"""
    return render(request, "write.html", {'form': BookForm()})

# @login_required


def practice(request):
    """Allow user to practice writing"""
    return render(request, "practice.html")


def user_profile(request, uid):
    """View user profile page"""
    return render(request, "userprofile.html")


def stats(request, id):
    """View project stats"""

    project = Project.objects.get(pk=id)
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
