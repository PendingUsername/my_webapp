# Import the Django admin module, which provides the default interface for managing models.
from django.contrib import admin

# Import the Item model that we want to register with the admin interface.
from .models import Item

# Register the Item model with the Django admin site.
# This allows the Item model to be managed through the default Django admin panel. You can add, modify, or delete Item instances from the admin interface.
admin.site.register(Item)
