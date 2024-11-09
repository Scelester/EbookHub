from rest_framework import serializers
from .models import Love, Bookmark, Rating, Comment, CommentLike
from basic.serializers import BookSerializer
from django.contrib.auth.models import User

# Love Serializer: Serialize the Love model
class LoveSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()  # Show the username
    book = BookSerializer()  # Include book details

    class Meta:
        model = Love
        fields = ['user', 'book', 'created_at']


# Bookmark Serializer: Serialize the Bookmark model
class BookmarkSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()  # Show the username
    book = BookSerializer()  # Include book details

    class Meta:
        model = Bookmark
        fields = ['user', 'book', 'created_at']


# Rating Serializer: Serialize the Rating model
class RatingSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()  # Show the username
    book = BookSerializer()  # Include book details

    class Meta:
        model = Rating
        fields = ['user', 'book', 'rating', 'created_at', 'updated_at']


# Comment Serializer: Serialize the Comment model
class CommentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()  # Show the username
    book = BookSerializer()  # Include book details

    class Meta:
        model = Comment
        fields = ['user', 'book', 'content', 'created_at', 'updated_at']


# CommentLike Serializer: Serialize the CommentLike model
class CommentLikeSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()  # Show the username
    comment = CommentSerializer()  # Include comment details

    class Meta:
        model = CommentLike
        fields = ['user', 'comment', 'created_at']


