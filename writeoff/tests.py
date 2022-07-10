from django.test import TestCase
from django.utils.text import slugify

# Create your tests here.
from .models import Project, Genre, User


class ProjectTestCase(TestCase):
    def setUp(self):
        """Database Setup"""
        user = User.objects.create_user(
            username='Bob', email='bobby@bob.com', password='123')
        login = self.client.login(username='Bob', password='123')
        fantasy = Genre.objects.create(name='Fantasy')
        self.projectNumber = 1000
        for i in range(0, self.projectNumber):
            Project.objects.create(title='Meditations',
                                   genre=fantasy, author=user)

    def testProjectsExist(self):
        """Check that test database was created"""
        qs = Project.objects.all()
        self.assertTrue(qs.exists())

    def testProjectCount(self):
        """Check number of projects"""
        projects = Project.objects.all()
        self.assertEqual(projects.count(), self.projectNumber)

    def testProjectUniqueSlug(self):
        """Test that no slugs based off the original slug match each other"""
        originalProject = Project.objects.all().order_by('id').first()
        similarProjects = Project.objects.exclude(
            slug__iexact=originalProject.slug)
        for project in similarProjects:
            self.assertNotEqual(project.slug, originalProject.slug)

    def testProjectSlug(self):
        """Test that slugify works correctly on original (no additional integers) title"""
        project = Project.objects.all().order_by('id').first()
        title = project.title
        slug = project.slug
        slugTitle = slugify(title)
        self.assertEqual(slug, slugTitle)

    def testProjectUniqueSlugBroad(self):
        """Wider range test to check that all slug values are unique"""
        slugList = Project.objects.all().values_list('slug', flat=True)
        uniqueSlugList = list(set(slugList))
        self.assertEqual(len(slugList), len(uniqueSlugList))

    # TODO Testing to check project edit updating
