from rest_framework import serializers
from basic.models import Book, Chapter, Author, Genre
from readers.models import Bookmark, Comment, CommentLike, Love, Rating
from django.contrib.auth.models import User


class ChapterTitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chapter
        fields = ['id', 'chapter_title']


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ['id', 'name', 'bio']  # You can customize fields as needed

# todo - edit this serialier to paginated books with the given genres
class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['id', 'name']


class BookSerializer(serializers.ModelSerializer):
    cover_image_url = serializers.SerializerMethodField()
    chapters = serializers.SerializerMethodField()
    author = AuthorSerializer()  # Nested AuthorSerializer to include the author details of the book
    genre = GenreSerializer(many=True)  # Nested GenreSerializer to include related genres

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
        # Get the default reverse setting from the user's profile
        reverse_from_profile = False
        request = self.context.get('request')

        # Retrieve the profile's reversed chapter order setting if user is authenticated
        if request and request.user.is_authenticated:
            profile = getattr(request.user, 'profile', None)
            if profile:
                reverse_from_profile = profile.reversed_chapter_order

        # Get the 'reverse' argument from the request
        request_reverse = self.context.get('reverse', None)

        # If 'reverse' is True in the request, flip the profile's setting
        if request_reverse:
            reverse = not reverse_from_profile
        else:
            reverse = reverse_from_profile

        # Retrieve the chapters, ordered based on the final 'reverse' value
        chapters = obj.chapters.all()[:5]
        if reverse:
            chapters = chapters[::-1]  # Reverse the chapter list if needed

        return ChapterTitleSerializer(chapters, many=True).data 



class BookDetailSerializer(serializers.ModelSerializer):
    cover_image_url = serializers.SerializerMethodField()
    chapters = ChapterTitleSerializer(many=True)
    genreNames = serializers.SerializerMethodField()  # Add this field to return genre names
    is_loved = serializers.SerializerMethodField()
    is_bookmarked = serializers.SerializerMethodField()
    user_rating = serializers.SerializerMethodField()
    comments = serializers.SerializerMethodField()
    author = AuthorSerializer()  # Nested AuthorSerializer for detailed author info
    genre = GenreSerializer(many=True)  # Nested GenreSerializer to return only related genres

    class Meta:
        model = Book
        fields = [
            'id', 'title', 'author', 'publisher', 'description', 'genreNames',
            'cover_image_url', 'date_published', 'can_fork', 'rating', 'file', 'chapters',
            'is_loved', 'is_bookmarked', 'user_rating', 'comments', 'genre'
        ]

    def get_cover_image_url(self, obj):
        request = self.context.get('request')
        cover_image_url = obj.cover_image_url()
        if cover_image_url and request:
            return request.build_absolute_uri(cover_image_url)
        return cover_image_url

    def get_genreNames(self, obj):
        return [genre.name for genre in obj.genre.all()]

    def get_is_loved(self, obj):
        user = self.context.get('user')  
        return Love.objects.filter(user=user, book=obj).exists()

    def get_is_bookmarked(self, obj):
        user = self.context.get('user')
        return Bookmark.objects.filter(user=user, book=obj).exists()

    def get_user_rating(self, obj):
        user = self.context.get('user')
        rating = Rating.objects.filter(user=user, book=obj).first()
        return rating.rating if rating else None

    def get_comments(self, obj):
        return Comment.objects.filter(book=obj).values('user__username', 'content', 'created_at')


class ChapterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chapter
        fields = ['id', 'chapter_title', 'content']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'  
