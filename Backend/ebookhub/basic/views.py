from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status, generics
from rest_framework.exceptions import PermissionDenied

from django.contrib.auth.models import User
from django.db import IntegrityError
from django.db.models import Q  

from .models import Author, Genre,Profile,Book
from .serializers import AuthorSerializer, UserSerializer, GenreSerializer,BookDetailSerializer



class SignupView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')
        full_name = request.data.get('full_name')
        role = request.data.get('role')
        
        # Check if the user with the provided username or email already exists
        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({"error": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Create the user
            user = User.objects.create_user(username=username, password=password, email=email)

            # Create the profile
            profile = Profile.objects.create(user=user, full_name=full_name, role=role)
            print("Profile created:", profile)  

            return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)

        except IntegrityError as e:
            print("IntegrityError:", e)  # Log the error for debugging
            return Response({"error": "Failed to create user"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            print("Exception:", e)  # Log any other exceptions
            return Response({"error": "An unexpected error occurred"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class TokenRefreshViewCustom(APIView):
    """
    Custom view for refreshing JWT access token using a refresh token.
    """
    # permission_classes = [IsAuthenticated]  

    def post(self, request):
        refresh_token = request.data.get('refresh')
        
        if not refresh_token:
            return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Create a refresh token object
            refresh = RefreshToken(refresh_token)
            # Generate a new access token
            new_access_token = str(refresh.access_token)
            
            return Response({
                'access': new_access_token
            }, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        username_or_email = request.data.get('username')
        password = request.data.get('password')
        
        user = User.objects.filter(Q(username=username_or_email) | Q(email=username_or_email)).first()
        
        if user and user.check_password(password):
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user_id':str(user.id)
            }, status=status.HTTP_200_OK)
        
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)




class AuthorDetailView(APIView):
    def get(self, request, id):
        try:
            author = Author.objects.get(id=id)  # Get the author by ID
            serializer = AuthorSerializer(author)
            return Response(serializer.data)
        except Author.DoesNotExist:
            return Response({'error': 'Author not found'}, status=status.HTTP_404_NOT_FOUND)

class PublisherDetailView(APIView):
    def get(self, request, id):
        try:
            publisher = User.objects.get(id=id)  # Get the user by ID (publisher)
            serializer = UserSerializer(publisher)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response({'error': 'Publisher not found'}, status=status.HTTP_404_NOT_FOUND)

class GenreDetailView(APIView):
    def get(self, request, id):
        try:
            genre = Genre.objects.get(id=id)  # Get the genre by ID
            serializer = GenreSerializer(genre)
            return Response(serializer.data)
        except Genre.DoesNotExist:
            return Response({'error': 'Genre not found'}, status=status.HTTP_404_NOT_FOUND)
        


class BookDetailView(generics.RetrieveAPIView):
    queryset = Book.objects.all()
    serializer_class = BookDetailSerializer
    lookup_field = 'id'
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def get_serializer_context(self):
        """
        Override this method to add the `user` to the context of the serializer.
        """
        context = super().get_serializer_context()
        if self.request.user.is_authenticated:
            context['user'] = self.request.user  # Add the authenticated user to the context
        return context

    def get(self, request, *args, **kwargs):
        # If user is not authenticated, raise PermissionDenied
        if not request.user.is_authenticated:
            raise PermissionDenied("You must be logged in to view this book detail.")

        return super().get(request, *args, **kwargs)