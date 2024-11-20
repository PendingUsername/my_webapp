from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import home

urlpatterns = [
    path('', home, name='home'),  # Home view
    path('admin/', admin.site.urls),  # Admin view
    path('api/', include('api.urls')),  # API endpoints - This includes your `create_superuser` as it is now part of `api.urls.py`
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # Endpoint to obtain JWT access and refresh tokens
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Endpoint to refresh JWT access token
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
