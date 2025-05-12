
"""
URL configuration for ecommerce_backend project.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/products/', include('products.urls')),
    path('api/auth/', include('authentication.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
