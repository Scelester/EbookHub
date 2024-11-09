from django.contrib import admin
from .models import Book, Chapter, Genre, SupportedFormat, Profile, Author

class ChapterInline(admin.TabularInline):
    model = Chapter
    extra = 1  # Show 1 empty chapter form by default

class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'publisher', 'date_published', 'format', 'can_fork')
    list_filter = ('genre', 'author', 'publisher', 'format')  # Filter by genre, author, and format
    search_fields = ('title', 'author__name', 'publisher__username', 'description')
    inlines = [ChapterInline]  # Display chapters inline with the book

    fieldsets = (
        (None, {
            'fields': ('title', 'author', 'publisher', 'description', 'genre', 'cover_image', 'can_fork','rating')
        }),
        ('Publication Details', {
            'fields': ('date_published', 'format'),
        }),
    )

class ChapterAdmin(admin.ModelAdmin):
    list_display = ('book', 'chapter_number', 'chapter_title', 'date_published')
    list_filter = ('book', 'chapter_number')
    search_fields = ('book__title', 'chapter_title')

admin.site.register(Book, BookAdmin)
admin.site.register(Chapter, ChapterAdmin)
admin.site.register(Genre)
admin.site.register(SupportedFormat)
admin.site.register(Profile)
admin.site.register(Author)  