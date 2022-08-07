from django import forms
from django_quill.forms import QuillFormField
from .models import Character, Project

# Form to Create a New Project


class ProjectForm(forms.ModelForm):
    class Meta:
        model = Project
        fields = ['title', 'genre']
        widgets = {
            'title': forms.TextInput(attrs={'class': 'project-title'}),
            'genre': forms.Select(attrs={'class': 'project-genre'}),
        }


class CharacterForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        project = kwargs.pop('project')
        super().__init__(*args, **kwargs)
        self.fields['affiliations'].queryset = Character.objects.filter(
            project=project)

    class Meta:
        model = Character
        fields = ['name', 'age', 'personality',
                  'appearance', 'affiliations', 'other']
        widgets = {
            'affiliations': forms.CheckboxSelectMultiple,
            'personality': forms.Textarea(attrs={'rows': 5, 'cols': 15}),
            'appearance': forms.Textarea(attrs={'rows': 5, 'cols': 15}),
            'other': forms.Textarea(attrs={'rows': 5, 'cols': 15})
        }
        labels = {
            'age':  'Age (Years)'
        }
