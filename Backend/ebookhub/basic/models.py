from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
import os


class Genre(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class SupportedFormat(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Author(models.Model):
    name = models.CharField(max_length=255)
    bio = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=255)
    role = models.CharField(max_length=50)
    favorite_genre = models.ManyToManyField(Genre, blank=True)

    def __str__(self):
        return self.full_name



class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.ForeignKey('Author', on_delete=models.SET_NULL, null=True, blank=True)
    publisher = models.ForeignKey(User, on_delete=models.CASCADE, related_name='published_books')
    description = models.TextField(blank=True, null=True)
    genre = models.ManyToManyField('Genre', blank=True)
    cover_image = models.ImageField(upload_to='book_covers/', blank=True, null=True)
    date_published = models.DateField()
    format = models.ForeignKey('SupportedFormat', on_delete=models.CASCADE)
    can_fork = models.BooleanField(default=False)
    ongoing = models.BooleanField(default=False)
    rating = models.DecimalField(max_digits=3, decimal_places=1, null=True, blank=True)
    file = models.FileField(upload_to='epub_books/', blank=True, null=True)


    def __str__(self):
        return self.title

    def cover_image_url(self):
        """Returns the full URL for the cover image."""
        if self.cover_image:
            return os.path.join(settings.MEDIA_URL, self.cover_image.url)
        return None


class Chapter(models.Model):
    book = models.ForeignKey(Book, related_name='chapters', on_delete=models.CASCADE)
    chapter_title = models.CharField(max_length=200)
    content = models.TextField()  
    chapter_number = models.PositiveIntegerField()
    date_published = models.DateField(auto_now_add=True)
    

    class Meta:
        ordering = ['chapter_number']

    def __str__(self):
        return f"{self.book.title} - Chapter {self.chapter_number}: {self.chapter_title}"


class Fork(models.Model):
    original_book = models.ForeignKey(Book, related_name='forks', on_delete=models.CASCADE)
    forked_by = models.ForeignKey(User, on_delete=models.CASCADE)
    forked_book = models.ForeignKey(Book, related_name='original', on_delete=models.CASCADE)
    date_forked = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"Fork of {self.original_book.title} by {self.forked_by.username}"
    


