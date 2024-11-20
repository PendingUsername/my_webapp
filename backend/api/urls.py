# backend/api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ItemViewSet, create_superuser, register_user, create_superusers  # Import create_superusers

router = DefaultRouter()
router.register(r'items', ItemViewSet, basename='item')

urlpatterns = [
    path('', include(router.urls)),  # Register all the routes for our API viewset
    path('create-superuser/', create_superuser, name='create_superuser'),  # Add the create-superuser route
    path('create-superusers/', create_superusers, name='create_superusers'),  # Add the create-superusers route
    path('register/', register_user, name='register_user'),  # Add the register-user route
]
