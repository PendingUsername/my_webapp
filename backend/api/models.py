from django.db import models

# Item model with name and description fields.
class Item(models.Model):
    name = models.CharField(max_length=100)  # Name of the item.
    description = models.TextField()  # Description of the item.

    # Return the name of the item when represented as a string.
    def __str__(self):
        return self.name
