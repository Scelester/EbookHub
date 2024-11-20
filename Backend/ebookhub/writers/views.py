from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from datetime import datetime
from django.core.exceptions import ValidationError
from django.utils.text import slugify
from basic.models import Book, Chapter, Fork, Author,Genre,SupportedFormat
from basic.serializers import BookSerializer, ChapterSerializer
import ebooklib
from ebooklib import epub
from bs4 import BeautifulSoup
from django.contrib.auth.models import User


class BooksByAuthorView(APIView):
    def get(self, request, author_id):
        # Get books written by the author (books where author is the given user)
        books = Book.objects.filter(author_id=author_id)
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class BooksForkedByUserView(APIView):
    def get(self, request, user_id):
        # Get books that are forked by the user
        forked_books = Fork.objects.filter(forked_by_id=user_id).values('forked_book')
        books = Book.objects.filter(id__in=forked_books)
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ForkBookView(APIView):
    def post(self, request, pk):
        try:
            original_book = Book.objects.get(pk=pk)
        except Book.DoesNotExist:
            return Response({"detail": "Book not found."}, status=status.HTTP_404_NOT_FOUND)

        # Check if the original book can be forked
        if not original_book.can_fork:
            return Response({"detail": "This book cannot be forked."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the user has already forked this book
        if Fork.objects.filter(original_book=original_book, forked_by=request.user).exists():
            return Response({"detail": "You have already forked this book."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the book is a fork, if so it can't be forked again
        if Fork.objects.filter(forked_book=original_book).exists():
            return Response({"detail": "This book has already been forked and cannot be forked again."}, status=status.HTTP_400_BAD_REQUEST)

        # Create a new forked book (copy of the original)
        forked_book = Book.objects.create(
            title=f"{original_book.title} [Forked]",
            author=original_book.author,
            publisher=request.user,  # The user who forks is the publisher
            genre=original_book.genre,
            description=original_book.description,
            cover_image=original_book.cover_image,
            date_published=datetime.now().strftime("%Y-%m-%d"),  # Set the current date as the publication date
            can_fork=False,  # Forked books cannot be forked again
            ongoing=original_book.ongoing,
        )

        # Create a Fork entry
        Fork.objects.create(
            original_book=original_book,
            forked_by=request.user,
            forked_book=forked_book,
        )

        # Serialize the forked book to return it in the response
        serializer = BookSerializer(forked_book)

        return Response({"detail": f"Book '{original_book.title}' has been forked successfully.", "forked_book": serializer.data}, status=status.HTTP_201_CREATED)


class UploadEPUBView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        epub_file = request.FILES.get('file')
        cover_file = request.FILES.get('cover_image')  # Cover image file

        if not epub_file:
            return Response({"detail": "No EPUB file provided."}, status=status.HTTP_400_BAD_REQUEST)

        # Validate and save the book data
        book_data = request.data
        book_title = book_data.get('title')
        book_author_name = book_data.get('author')
        book_genre_list = book_data.get('genre')  
        book_description = book_data.get('description')
        user_id = book_data.get('user_id')  # Get user_id from the request data

        if not all([book_title, book_author_name, book_genre_list, book_description, user_id]):
            return Response({"detail": "Missing book details or user_id."}, status=status.HTTP_400_BAD_REQUEST)

        # Retrieve the user instance for publisher
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"detail": "Invalid user_id."}, status=status.HTTP_400_BAD_REQUEST)

        # Get or create the author instance
        author, created = Author.objects.get_or_create(name=book_author_name)

        # Assuming 'Format' model exists and you have a default format entry
        default_format, _ = SupportedFormat.objects.get_or_create(name='EPUB')

        # Process genre list
        genres = []
        for genre_name in book_genre_list.split():
            genre_name = genre_name.title()
            genre, created = Genre.objects.get_or_create(name=genre_name)
            genres.append(genre)

        # Create the book instance with the format and cover (if provided)
        book = Book.objects.create(
            title=book_title,
            author=author,
            publisher=user,
            description=book_description,
            file=epub_file,
            cover_image=cover_file if cover_file else None,  # Assign cover file if provided
            format=default_format,
            date_published=datetime.now().strftime("%Y-%m-%d")
        )

        # Associate genres with the book
        book.genre.set(genres)

        try:
            book = self.extract_chapters_from_epub(book)
        except Exception as e:
            print("error:===========",e)
            return Response({"detail": f"Failed to extract chapters: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"detail": f"Book '{book.title}' uploaded successfully."}, status=status.HTTP_201_CREATED)

    def extract_chapters_from_epub(self, book):
        # Open the EPUB file
        epub_book = epub.read_epub(book.file.path)

        # Extract the chapters
        chapter_order = 1
        for item in epub_book.get_items():
            if item.get_type() == ebooklib.ITEM_DOCUMENT:
                # Extract the content of each chapter
                soup = BeautifulSoup(item.content, 'html.parser')

                # Extract the title of the chapter
                chapter_title_tag = soup.find('p', class_='chaptertitle')

                # Check if the chapter title element is found
                if chapter_title_tag:
                    chapter_title = chapter_title_tag.get_text(strip=True)
                else:
                    chapter_title = f"Chapter {chapter_order}"
                
                # Preserve spaces and newlines
                chapter_content = soup.prettify(formatter="minimal")  # Keep formatting intact

                # Create and save each chapter
                Chapter.objects.create(
                    book=book,
                    chapter_title=chapter_title,
                    content=chapter_content,
                    chapter_number=chapter_order
                )

                chapter_order += 1

        return book


class ChapterListView(APIView):
    def get(self, request, book_id):
        chapters = Chapter.objects.filter(book_id=book_id)
        # You can limit the number of chapters displayed, e.g., 20 chapters
        chapters = chapters[:20]
        # You should create a ChapterSerializer for this
        serializer = ChapterSerializer(chapters, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ChapterCreateView(APIView):
    def post(self, request, book_id):
        chapter_title = request.data.get('title')
        chapter_content = request.data.get('content')

        if not all([chapter_title, chapter_content]):
            return Response({"detail": "Missing chapter details."}, status=status.HTTP_400_BAD_REQUEST)

        # Create and save the chapter
        chapter = Chapter.objects.create(
            book_id=book_id,
            title=chapter_title,
            content=chapter_content,
            order=Chapter.objects.filter(book_id=book_id).count() + 1  # Automatically set the next order
        )

        return Response({"detail": f"Chapter '{chapter.title}' created successfully."}, status=status.HTTP_201_CREATED)


class ChapterUpdateView(APIView):
    def put(self, request, book_id, chapter_id):
        try:
            chapter = Chapter.objects.get(book_id=book_id, id=chapter_id)
        except Chapter.DoesNotExist:
            return Response({"detail": "Chapter not found."}, status=status.HTTP_404_NOT_FOUND)

        chapter.title = request.data.get('title', chapter.title)
        chapter.content = request.data.get('content', chapter.content)

        chapter.save()
        return Response({"detail": f"Chapter '{chapter.title}' updated successfully."}, status=status.HTTP_200_OK)


class ChapterDeleteView(APIView):
    def delete(self, request, book_id, chapter_id):
        try:
            chapter = Chapter.objects.get(book_id=book_id, id=chapter_id)
        except Chapter.DoesNotExist:
            return Response({"detail": "Chapter not found."}, status=status.HTTP_404_NOT_FOUND)

        chapter.delete()
        return Response({"detail": f"Chapter '{chapter_id}' deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
