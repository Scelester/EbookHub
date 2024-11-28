from django.urls import path
from readers import views
urlpatterns = [
    path('books/', views.BookList.as_view(), name='book-list'),  
    path('books/<int:book_id>/c/<int:chapter_id>/', views.ChapterDetail.as_view(), name='chapter-detail'),    

    # Routes for a specific book's actions by user 
    path('books/<int:book_id>/loves/', views.LoveList.as_view(), name='love-list'),
    path('books/<int:book_id>/bookmarks/', views.BookmarkList.as_view(), name='bookmark-list'),
    path('books/<int:book_id>/ratings/', views.RatingList.as_view(), name='rating-list'),
    path('books/<int:book_id>/comments/', views.CommentList.as_view(), name='comment-list'),
    path('books/<int:book_id>/comment-likes/', views.CommentLikeList.as_view(), name='comment-like-list'),
    path('books/<int:id>/', views.BookDetailView.as_view(), name='book-detail'),
    
    # Routes for listing books that a user has interacted with
    path('users/<int:user_id>/loved-books/', views.BooksLovedByUserView.as_view(), name='books-loved-by-user'),
    path('users/<int:user_id>/bookmarked-books/', views.BooksBookmarkedByUserView.as_view(), name='books-bookmarked-by-user'),
    path('users/<int:user_id>/rated-books/', views.BooksRatedByUserView.as_view(), name='books-rated-by-user'),
    path('users/<int:user_id>/commented-books/', views.BooksCommentedByUserView.as_view(), name='books-commented-by-user'),
    
]
