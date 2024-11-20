from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination

from django.contrib.auth.models import User
from django.db.models import Avg  # Import Avg for aggregation

from basic.models import Book
from basic.serializers import BookSerializer
from readers.models import Love, Bookmark, Rating, Comment, CommentLike
from readers.serializers import LoveSerializer, BookmarkSerializer, RatingSerializer, CommentSerializer, CommentLikeSerializer


# Pagination Class
class BookPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


# Book List View - List all books
class BookList(APIView):
    def get(self, request):
        books = Book.objects.all().order_by('id')
        paginator = BookPagination()
        result_page = paginator.paginate_queryset(books, request)
        serializer = BookSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)



class LoveList(APIView):
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def get(self, request, book_id):
        loves = Love.objects.filter(book_id=book_id)
        serializer = LoveSerializer(loves, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, book_id):
        user = request.user  # Get the authenticated user
        book = Book.objects.filter(id=book_id).first()

        if not book:
            return Response({"detail": "Book not found."}, status=status.HTTP_404_NOT_FOUND)

        if Love.objects.filter(user=user, book=book).exists():
            return Response({"detail": "You have already loved this book."}, status=status.HTTP_400_BAD_REQUEST)

        love = Love(user=user, book=book)
        love.save()

        serializer = LoveSerializer(love)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def delete(self, request, book_id):
        user = request.user  # Get the authenticated user
        book = Book.objects.filter(id=book_id).first()

        if not book:
            return Response({"detail": "Book not found."}, status=status.HTTP_404_NOT_FOUND)

        love = Love.objects.filter(user=user, book=book).first()
        if not love:
            return Response({"detail": "You have not loved this book."}, status=status.HTTP_404_NOT_FOUND)

        love.delete()
        return Response({"detail": "Love removed."}, status=status.HTTP_204_NO_CONTENT)


class BookmarkList(APIView):
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def get(self, request, book_id):
        bookmarks = Bookmark.objects.filter(book_id=book_id)
        serializer = BookmarkSerializer(bookmarks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, book_id):
        user = request.user  # Get the authenticated user
        book = Book.objects.filter(id=book_id).first()

        if not book:
            return Response({"detail": "Book not found."}, status=status.HTTP_404_NOT_FOUND)

        if Bookmark.objects.filter(user=user, book=book).exists():
            return Response({"detail": "You have already bookmarked this book."}, status=status.HTTP_400_BAD_REQUEST)

        bookmark = Bookmark(user=user, book=book)
        bookmark.save()

        serializer = BookmarkSerializer(bookmark)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def delete(self, request, book_id):
        user = request.user  # Get the authenticated user
        book = Book.objects.filter(id=book_id).first()

        if not book:
            return Response({"detail": "Book not found."}, status=status.HTTP_404_NOT_FOUND)

        bookmark = Bookmark.objects.filter(user=user, book=book).first()
        if not bookmark:
            return Response({"detail": "You have not bookmarked this book."}, status=status.HTTP_404_NOT_FOUND)

        bookmark.delete()
        serializer = BookmarkSerializer(bookmark)
        return Response(serializer.data, status=status.HTTP_204_NO_CONTENT)




class RatingList(APIView):
    def get(self, request, book_id):
        # Retrieve all ratings for the book
        ratings = Rating.objects.filter(book_id=book_id)
        serializer = RatingSerializer(ratings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, book_id):
        user_id = request.data.get('user_id')  # Get user_id from the request
        rating = request.data.get('rating')  # Get the rating value

        # Ensure user and book exist
        user = User.objects.filter(id=user_id).first()
        book = Book.objects.filter(id=book_id).first()

        if not user or not book:
            return Response({"detail": "User or Book not found."}, status=status.HTTP_404_NOT_FOUND)

        # Validate the rating value
        try:
            rating = float(rating)
        except ValueError:
            return Response({"detail": "Rating must be a number."}, status=status.HTTP_400_BAD_REQUEST)

        if rating < 0 or rating > 5:
            return Response({"detail": "Rating must be between 0 and 5."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the user has already rated this book
        existing_rating = Rating.objects.filter(user_id=user_id, book_id=book_id).first()
        if existing_rating:
            existing_rating.rating = rating
            existing_rating.save()
        else:
            # Create a new rating
            Rating.objects.create(user_id=user_id, book_id=book_id, rating=rating)

        # Calculate the new average rating for the book
        avg_rating = Rating.objects.filter(book_id=book_id).aggregate(Avg('rating'))['rating__avg']
        book.rating = round(avg_rating, 2)  # Update the book's rating field
        book.save()

        return Response({"detail": "Rating updated successfully.", "average_rating": book.rating}, status=status.HTTP_200_OK)



# Comment List View - List all comments on books
class CommentList(APIView):
    def get(self, request, book_id):
        comments = Comment.objects.filter(book_id=book_id)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, book_id):
        user_id = request.data.get('user_id')  # Get user_id from the request
        content = request.data.get('content')

        user = User.objects.filter(id=user_id).first()  # Retrieve the user object
        book = Book.objects.filter(id=book_id).first()  # Retrieve the book object

        if not user or not book:
            return Response({"detail": "User or Book not found."}, status=status.HTTP_404_NOT_FOUND)

        if not content:
            return Response({"detail": "Content cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)

        comment = Comment(user_id=user_id, book_id=book_id, content=content)
        comment.save()

        serializer = CommentSerializer(comment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# Comment Like List View - List all comment likes
class CommentLikeList(APIView):
    def get(self, request, book_id):
        comment_likes = CommentLike.objects.filter(book_id=book_id)
        serializer = CommentLikeSerializer(comment_likes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, book_id):
        user_id = request.data.get('user_id')  # Get user_id from the request
        comment_id = request.data.get('comment_id')  # Get comment_id from the request

        user = User.objects.filter(id=user_id).first()  # Retrieve the user object
        comment = Comment.objects.filter(id=comment_id).first()  # Retrieve the comment object

        if not user or not comment:
            return Response({"detail": "User or Comment not found."}, status=status.HTTP_404_NOT_FOUND)

        if CommentLike.objects.filter(user_id=user, comment_id=comment_id).exists():
            return Response({"detail": "You have already liked this comment."}, status=status.HTTP_400_BAD_REQUEST)

        comment_like = CommentLike(user_id=user_id, comment_id=comment_id)
        comment_like.save()

        serializer = CommentLikeSerializer(comment_like)
        return Response(serializer.data, status=status.HTTP_201_CREATED)



# View for listing books loved by a user with pagination
class BooksLovedByUserView(APIView):
    def get(self, request, user_id):
        loves = Love.objects.filter(user_id=user_id)
        book_ids = loves.values_list('book_id', flat=True)
        books = Book.objects.filter(id__in=book_ids)
        
        # Apply pagination
        paginator = BookPagination()
        result_page = paginator.paginate_queryset(books, request)
        
        serializer = BookSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)


# View for listing books bookmarked by a user with pagination
class BooksBookmarkedByUserView(APIView):
    def get(self, request, user_id):
        bookmarks = Bookmark.objects.filter(user_id=user_id)
        book_ids = bookmarks.values_list('book_id', flat=True)
        books = Book.objects.filter(id__in=book_ids)
        
        # Apply pagination
        paginator = BookPagination()
        result_page = paginator.paginate_queryset(books, request)
        
        serializer = BookSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)


# View for listing books rated by a user with pagination
class BooksRatedByUserView(APIView):
    def get(self, request, user_id):
        ratings = Rating.objects.filter(user_id=user_id)
        book_ids = ratings.values_list('book_id', flat=True)
        books = Book.objects.filter(id__in=book_ids)
        
        # Apply pagination
        paginator = BookPagination()
        result_page = paginator.paginate_queryset(books, request)
        
        serializer = BookSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)


# View for listing books commented on by a user with pagination
class BooksCommentedByUserView(APIView):
    def get(self, request, user_id):
        comments = Comment.objects.filter(user_id=user_id)
        book_ids = comments.values_list('book_id', flat=True)
        books = Book.objects.filter(id__in=book_ids)
        
        # Apply pagination
        paginator = BookPagination()
        result_page = paginator.paginate_queryset(books, request)
        
        serializer = BookSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)
