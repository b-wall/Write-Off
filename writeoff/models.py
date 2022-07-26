from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db.models.signals import pre_save, post_save

from .utils import slugifyProjectTitle


class User(AbstractUser):
    pass


class Genre(models.Model):
    name = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']


class Project(models.Model):
    author = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="creator")
    title = models.CharField(max_length=60)
    slug = models.SlugField(unique=True, blank=True, null=True)
    genre = models.ForeignKey(
        Genre, on_delete=models.CASCADE, related_name="project")
    created = models.DateTimeField(auto_now_add=True)
    edited = models.DateTimeField(auto_now=True)
    completed = models.BooleanField(default=False)

    def progress(self):
        try:
            totalEvents = self.timeline.all().count()
            completedEvents = self.timeline.filter(completed=True).count()
            return round((completedEvents/totalEvents)*100)
        except (AttributeError, ZeroDivisionError):
            return 0

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-edited']


class Character(models.Model):
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name="character")
    name = models.CharField(max_length=50)
    age = models.IntegerField(blank=True, null=True)
    personality = models.TextField(blank=True)
    appearance = models.TextField(blank=True)
    affiliations = models.ManyToManyField(
        'self', blank=True, symmetrical=True)
    other = models.TextField(blank=True)

    def __str__(self):
        return f"{self.project} | {self.name}"

    class Meta:
        ordering = ['name']


class TimelineItem(models.Model):
    project = models.ForeignKey(
        Project, on_delete=models.CASCADE, related_name="timeline")
    title = models.CharField(max_length=100, blank=True)
    content = models.TextField(blank=True)
    characters = models.ManyToManyField(Character, blank=True)
    columnId = models.PositiveIntegerField(
        default=1, validators=[MinValueValidator(1), MaxValueValidator(3)])
    beginningOrder = models.PositiveIntegerField(null=True, blank=True)
    middleOrder = models.PositiveIntegerField(null=True, blank=True)
    endOrder = models.PositiveIntegerField(null=True, blank=True)
    time = models.CharField(max_length=30, blank=True)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.project} | {self.title} | {self.beginningOrder} | {self.middleOrder} | {self.endOrder}"


# Create Unique Slug on Save


def projectPreSave(sender, instance, *args, **kwargs):
    if instance.slug is None:
        slugifyProjectTitle(instance, save=False)


pre_save.connect(projectPreSave, sender=Project)


def projectPostSave(sender, instance, created, *args, **kwargs):
    if created:
        slugifyProjectTitle(instance, save=True)


post_save.connect(projectPostSave, sender=Project)


# Refresh edited project's edited status on Save

def characterPreSave(sender, instance, *args, **kwargs):
    project = Project.objects.get(id=instance.project.id)
    project.save()


pre_save.connect(characterPreSave, sender=Character)


def TimelineItemPreSave(sender, instance, *args, **kwargs):
    project = Project.objects.get(id=instance.project.id)
    project.save()


pre_save.connect(TimelineItemPreSave, sender=TimelineItem)
