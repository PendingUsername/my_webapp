from rest_framework import serializers
from .models import Item

# Serializer class to convert Item model instances into JSON format and vice versa.
class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item  # Define the model to serialize
        fields = '__all__'  # Include all fields from the Item model

