from django import forms
from django_quill.forms import QuillFormField
from .models import Project

# Form to Create a New Project


class ProjectForm(forms.ModelForm):
    class Meta:
        model = Project
        fields = ['title', 'genre']
        widgets = {
            'title': forms.TextInput(attrs={'class': 'project-title'}),
            'genre': forms.Select(attrs={'class': 'project-genre'}),
        }


class BookForm(forms.Form):
    content = QuillFormField()
