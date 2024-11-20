# backend/api/views.py

from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Item
from .serializers import ItemSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from django.db.utils import IntegrityError
from django.contrib.auth.hashers import make_password

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated]  # Ensure authentication is required for accessing CRUD features

# Function to create a superuser
@api_view(['POST'])
@permission_classes([AllowAny])
def create_superuser(request):
    User = get_user_model()

    # Get details from request data or set default values
    username = request.data.get('username', 'admin')
    email = request.data.get('email', 'admin@example.com')
    password = request.data.get('password', 'password')

    # Check if a superuser or a user with the provided username already exists
    if User.objects.filter(username=username).exists():
        return Response({'message': f'User with username "{username}" already exists.'}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(is_superuser=True, username=username).exists():
        return Response({'message': f'A superuser with username "{username}" already exists.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Create the superuser with the provided details
        User.objects.create_superuser(username=username, email=email, password=password)
        return Response({'message': 'Superuser created successfully.'}, status=status.HTTP_201_CREATED)
    except IntegrityError:
        return Response({'message': 'A user with the provided email already exists.'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# Function to create multiple superusers
@api_view(['POST'])
@permission_classes([AllowAny])
def create_superusers(request):
    User = get_user_model()
    users_data = request.data.get('users', [])

    # If users_data is not provided or empty
    if not users_data:
        return Response({'message': 'No users data provided.'}, status=status.HTTP_400_BAD_REQUEST)

    results = []

    for user_data in users_data:
        username = user_data.get('username')
        email = user_data.get('email', '')
        password = user_data.get('password')

        if not username or not password:
            results.append({'username': username, 'status': 'failed', 'reason': 'Username and password are required.'})
            continue

        if User.objects.filter(username=username).exists():
            results.append({'username': username, 'status': 'failed', 'reason': 'Username already exists.'})
            continue

        if User.objects.filter(is_superuser=True, username=username).exists():
            results.append({'username': username, 'status': 'failed', 'reason': 'A superuser with this username already exists.'})
            continue

        try:
            # Create the superuser
            User.objects.create_superuser(username=username, email=email, password=password)
            results.append({'username': username, 'status': 'success', 'message': 'Superuser created successfully.'})
        except IntegrityError:
            results.append({'username': username, 'status': 'failed', 'reason': 'A user with the provided email already exists.'})
        except Exception as e:
            results.append({'username': username, 'status': 'failed', 'reason': str(e)})

    return Response(results, status=status.HTTP_201_CREATED)

# Function to register a new user
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    User = get_user_model()

    # Get details from request data
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    # Check if the username or email already exists
    if User.objects.filter(username=username).exists():
        return Response({'message': f'User with username "{username}" already exists.'}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(email=email).exists():
        return Response({'message': f'User with email "{email}" already exists.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Create a regular user
        User.objects.create(username=username, email=email, password=make_password(password))
        return Response({'message': 'User registered successfully.'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
