from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from basic.models import Book
from basic.serializers import BookSerializer
from readers.models import Love, Bookmark, Rating, Comment, CommentLike
from readers.serializers import LoveSerializer, BookmarkSerializer, RatingSerializer, CommentSerializer, CommentLikeSerializer
from rest_framework.pagination import PageNumberPagination


# Pagination Class
class BookPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


# Book List View - List all books
class BookList(APIView):
    def get(self, request):
        books = Book.objects.all()
        paginator = BookPagination()
        result_page = paginator.paginate_queryset(books, request)
        serializer = BookSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)


# Love List View - List all loves (user-book relationships)
class LoveList(APIView):
    def get(self, request, book_id):
        loves = Love.objects.filter(book_id=book_id)
        serializer = LoveSerializer(loves, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, book_id):
        user = request.data.get('user')
        book = request.data.get('book')

        if Love.objects.filter(user=user, book=book).exists():
            return Response({"detail": "You have already loved this book."}, status=status.HTTP_400_BAD_REQUEST)

        love = Love(user_id=user, book_id=book)
        love.save()

        serializer = LoveSerializer(love)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# Bookmark List View - List all bookmarks (user-book relationships)
class BookmarkList(APIView):
    def get(self, request, book_id):
        bookmarks = Bookmark.objects.filter(book_id=book_id)
        serializer = BookmarkSerializer(bookmarks, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, book_id):
        user = request.data.get('user')
        book = request.data.get('book')

        if Bookmark.objects.filter(user=user, book=book).exists():
            return Response({"detail": "You have already bookmarked this book."}, status=status.HTTP_400_BAD_REQUEST)

        bookmark = Bookmark(user_id=user, book_id=book)
        bookmark.save()

        serializer = BookmarkSerializer(bookmark)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# Rating List View - List all ratings (user-book ratings)
class RatingList(APIView):
    def get(self, request, book_id):
        ratings = Rating.objects.filter(book_id=book_id)
        serializer = RatingSerializer(ratings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, book_id):
        user = request.data.get('user')
        book = request.data.get('book')
        rating = request.data.get('rating')

        if rating < 0 or rating > 5:
            return Response({"detail": "Rating must be between 0 and 5."}, status=status.HTTP_400_BAD_REQUEST)

        existing_rating = Rating.objects.filter(user=user, book=book).first()
        if existing_rating:
            existing_rating.rating = rating
            existing_rating.save()
            serializer = RatingSerializer(existing_rating)
            return Response(serializer.data, status=status.HTTP_200_OK)

        rating_obj = Rating(user_id=user, book_id=book, rating=rating)
        rating_obj.save()

        serializer = RatingSerializer(rating_obj)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# Comment List View - List all comments on books
class CommentList(APIView):
    def get(self, request, book_id):
        comments = Comment.objects.filter(book_id=book_id)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, book_id):
        user = request.data.get('user')
        content = request.data.get('content')

        if not content:
            return Response({"detail": "Content cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)

        comment = Comment(user_id=user, book_id=book_id, content=content)
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
        user = request.data.get('user')
        comment = request.data.get('comment')

        if CommentLike.objects.filter(user=user, comment=comment).exists():
            return Response({"detail": "You have already liked this comment."}, status=status.HTTP_400_BAD_REQUEST)

        comment_like = CommentLike(user_id=user, comment_id=comment)
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
