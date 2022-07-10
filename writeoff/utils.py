import random
from django.utils.text import slugify


def slugifyProjectTitle(instance, save=False, newSlug=None):
    if newSlug is not None:
        slug = newSlug
    else:
        slug = slugify(instance.title)
    currentModel = instance.__class__
    qs = currentModel.objects.filter(slug=slug).exclude(id=instance.id)
    if qs.exists():
        randInt = random.randint(200_000, 500_000)
        slug = f"{slug}-{randInt}"
        return slugifyProjectTitle(instance, save=save, newSlug=slug)
    instance.slug = slug
    if save:
        instance.save()
