from django import forms
from django_quill.forms import QuillFormField


class BookForm(forms.Form):
    content = QuillFormField()
