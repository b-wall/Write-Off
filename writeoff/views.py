from django.shortcuts import render
from django.contrib.auth.decorators import login_required

from .forms import BookForm


# @login_required
def index(request):
    """Display Project Overview"""
    return render(request, "index.html")


def landingpage(request):
    """Display landing page"""
    return render(request, "landing.html")


def characters(request):
    """Display Character Page"""
    return render(request, "characters.html")


def timeline(request):
    """Display Timeline View"""
    return render(request, "timeline.html")


def write(request):
    """Display page to write content"""
    return render(request, "write.html", {'form': BookForm()})


def practice(request):
    """Allow user to practice writing"""
    return render(request, "practice.html")


def register(request):
    """Allow user to register an account"""
    return render(request, "register.html")


def login(request):
    """Display login page"""
    return render(request, "login.html")
