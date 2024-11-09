from django.db import models
from django.contrib.auth.models import User
from basic.models import Book

# Love model: Track users who "love" a book
class Love(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='loved_books')
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='loves')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'book')  # Ensure one love per user per book

    def __str__(self):
        return f'{self.user.username} loves {self.book.title}'

# Bookmark model: Track users who bookmark a book
class Bookmark(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookmarked_books')
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='bookmarks')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'book')  

    def __str__(self):
        return f'{self.user.username} bookmarked {self.book.title}'

# Rating model: Track user ratings for books
class Rating(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ratings')
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='ratings')
    rating = models.DecimalField(max_digits=3, decimal_places=1)  # Rating from 0 to 5
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)  # Track the time of the last update

    class Meta:
        unique_together = ('user', 'book')  # Ensure one rating per user per book

    def __str__(self):
        return f'{self.user.username} rated {self.book.title} {self.rating}'

# Comment model: Track user comments on books
class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)  # Track when the comment was last updated

    def __str__(self):
        return f'Comment by {self.user.username} on {self.book.title}'

# CommentLike model: Track users who like a comment on a book
class CommentLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='liked_comments')
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'comment')  # Ensure one like per user per comment

    def __str__(self):
        return f'{self.user.username} liked a comment by {self.comment.user.username} on {self.comment.book.title}'

