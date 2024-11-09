from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.models import User
from django.db.models import Q  # complex Queries

class UsernameOrEmailBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            # Check if the input is an email or username
            user = User.objects.get(Q(username=username) | Q(email=username))
        except User.DoesNotExist:
            return None
        
        if user.check_password(password):
            return user
        return None
