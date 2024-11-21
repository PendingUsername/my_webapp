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

# ViewSet to handle CRUD operations for the Item model
class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()  # Retrieve all items from the database
    serializer_class = ItemSerializer  # Use the ItemSerializer to handle serialization/deserialization
    permission_classes = [IsAuthenticated]  # Require authentication to access CRUD endpoints

# Function to create a single superuser
@api_view(['POST'])
@permission_classes([AllowAny])  # Allow anyone to access this endpoint
def create_superuser(request):
    User = get_user_model()

    # Extract details from the request data, with default values
    username = request.data.get('username', 'admin')
    email = request.data.get('email', 'admin@example.com')
    password = request.data.get('password', 'password')

    # Check if a user or superuser with the provided username already exists
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
@permission_classes([AllowAny])  # Allow anyone to access this endpoint
def create_superusers(request):
    User = get_user_model()
    users_data = request.data.get('users', [])

    # If no users data provided in the request
    if not users_data:
        return Response({'message': 'No users data provided.'}, status=status.HTTP_400_BAD_REQUEST)

    results = []

    # Loop through each user data provided in the request
    for user_data in users_data:
        username = user_data.get('username')
        email = user_data.get('email', '')
        password = user_data.get('password')

        # Validate username and password are provided
        if not username or not password:
            results.append({'username': username, 'status': 'failed', 'reason': 'Username and password are required.'})
            continue

        # Check if the username already exists
        if User.objects.filter(username=username).exists():
            results.append({'username': username, 'status': 'failed', 'reason': 'Username already exists.'})
            continue

        # Check if the superuser with this username already exists
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

# Function to register a new regular user
@api_view(['POST'])
@permission_classes([AllowAny])  # Allow anyone to access this endpoint
def register_user(request):
    User = get_user_model()

    # Extract details from request data
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    # Validate if the username or email already exists
    if User.objects.filter(username=username).exists():
        return Response({'message': f'User with username "{username}" already exists.'}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(email=email).exists():
        return Response({'message': f'User with email "{email}" already exists.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Create a new regular user with hashed password
        User.objects.create(username=username, email=email, password=make_password(password))
        return Response({'message': 'User registered successfully.'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
