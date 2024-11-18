# backend/api/admin.py
from django.contrib import admin
from .models import Item

# Register the Item model with the Django admin site
admin.site.register(Item)
