from rest_framework import serializers
from basic.models import Book, Chapter,Author,Genre
from django.contrib.auth.models import User

class ChapterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chapter
        fields = ['id', 'chapter_title', 'content']

class BookSerializer(serializers.ModelSerializer):
    cover_image_url = serializers.SerializerMethodField()
    chapters = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = ['id', 'title', 'author', 'publisher', 'description', 'genre', 'cover_image_url', 'date_published', 'can_fork', 'rating', 'file', 'chapters']

    def get_cover_image_url(self, obj):
        request = self.context.get('request')
        cover_image_url = obj.cover_image_url()
        if cover_image_url and request:
            return request.build_absolute_uri(cover_image_url)
        return cover_image_url

    def get_chapters(self, obj):
        # Get the first 5 chapters only
        chapters = obj.chapters.all()[:5]
        serializer = ChapterSerializer(chapters, many=True)
        return serializer.data
    

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = '__all__'  # This includes all fields from the Author model


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'  # This includes all fields from the User model


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = '__all__'  # This includes all fields from the Genre model