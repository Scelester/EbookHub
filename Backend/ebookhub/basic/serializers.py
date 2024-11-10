from rest_framework import serializers
from basic.models import Book, Chapter,Author,Genre
from django.contrib.auth.models import User



class ChapterTitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chapter
        fields = ['id', 'chapter_title'] 


class BookSerializer(serializers.ModelSerializer):
    cover_image_url = serializers.SerializerMethodField()
    chapters = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = [
            'id', 'title', 'author', 'publisher', 'description', 'genre',
            'cover_image_url', 'date_published', 'can_fork', 'rating', 'file', 'chapters'
        ]

    def get_cover_image_url(self, obj):
        request = self.context.get('request')
        cover_image_url = obj.cover_image_url()
        if cover_image_url and request:
            return request.build_absolute_uri(cover_image_url)
        return cover_image_url

    def get_chapters(self, obj):
        # Fetch only the first 5 chapters for summary view
        chapters = obj.chapters.all()[:5]
        return ChapterTitleSerializer(chapters, many=True).data
    
    



class BookDetailSerializer(serializers.ModelSerializer):
    cover_image_url = serializers.SerializerMethodField()
    chapters = ChapterTitleSerializer(many=True)
    genreNames = serializers.SerializerMethodField()  # Add this field to return genre names

    class Meta:
        model = Book
        fields = [
            'id', 'title', 'author', 'publisher', 'description', 'genreNames',
            'cover_image_url', 'date_published', 'can_fork', 'rating', 'file', 'chapters'
        ]

    def get_cover_image_url(self, obj):
        request = self.context.get('request')
        cover_image_url = obj.cover_image_url()
        if cover_image_url and request:
            return request.build_absolute_uri(cover_image_url)
        return cover_image_url

    def get_genreNames(self, obj):
        # Return the names of the genres associated with the book
        return [genre.name for genre in obj.genre.all()]



class ChapterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chapter
        fields = ['id', 'chapter_title', 'content']



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