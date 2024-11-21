# Import the AppConfig class from Django's apps module, which is used to configure the application.
from django.apps import AppConfig

# Define a configuration class for the 'api' application. This class allows specifying configuration options for the app.
class ApiConfig(AppConfig):
    # Set the default primary key field type to BigAutoField, which is used for auto-incrementing primary keys.
    default_auto_field = 'django.db.models.BigAutoField'
    # Set the name of the application to 'api'. This is used by Django to reference this app configuration.
    name = 'api'
