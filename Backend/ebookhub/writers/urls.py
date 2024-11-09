from django.urls import path
from .views import BooksByAuthorView, BooksForkedByUserView, ForkBookView,UploadEPUBView

urlpatterns = [
    path('authors/<int:author_id>/books/', BooksByAuthorView.as_view(), name='books-by-author'),
    path('users/<int:user_id>/forked-books/', BooksForkedByUserView.as_view(), name='books-forked-by-user'),
    path('books/<int:pk>/fork/', ForkBookView.as_view(), name='fork-book'),
    path('upload-epub/', UploadEPUBView.as_view(), name='upload-epub'),
]
    