from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.SignupView.as_view(), name='signup'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('authors/<int:id>/', views.AuthorDetailView.as_view(), name='author-detail'),
    path('publishers/<int:id>/', views.PublisherDetailView.as_view(), name='publisher-detail'),
    path('genres/<int:id>/', views.GenreDetailView.as_view(), name='genre-detail'),
]
