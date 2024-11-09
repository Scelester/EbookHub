from django.contrib import admin


from .models import Bookmark, Comment,Love,Rating,CommentLike

admin.site.register(Bookmark)
admin.site.register(Comment)
admin.site.register(Love)
admin.site.register(Rating)
admin.site.register(CommentLike)
