
# Django Backend API Guide

To implement a Django backend that works with the React frontend, follow these steps:

## 1. Setup Django Project

```bash
# Create virtual environment
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate

# Install Django and required packages
pip install django djangorestframework django-cors-headers

# Create project
django-admin startproject ecommerce_backend
cd ecommerce_backend

# Create apps
python manage.py startapp products
python manage.py startapp authentication
```

## 2. Configure Django Settings

In `ecommerce_backend/settings.py`:

```python
INSTALLED_APPS = [
    # ...existing apps
    'rest_framework',
    'corsheaders',
    'products',
    'authentication',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    # ...other middleware
]

# Allow frontend to access the API
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # Your React app URL
]

# Rest Framework settings
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}
```

## 3. Authentication Models

In `authentication/models.py`:

```python
from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.user.username
```

## 4. Product Models

In `products/models.py`:

```python
from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='products/', null=True, blank=True)
    
    def __str__(self):
        return self.name
```

## 5. Serializers

In `products/serializers.py`:

```python
from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
```

In `authentication/serializers.py`:

```python
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    full_name = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'full_name']
    
    def create(self, validated_data):
        full_name = validated_data.pop('full_name')
        user = User.objects.create_user(**validated_data)
        UserProfile.objects.create(user=user, full_name=full_name)
        return user
```

## 6. Views

In `products/views.py`:

```python
from rest_framework import viewsets
from .models import Product
from .serializers import ProductSerializer

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
```

In `authentication/views.py`:

```python
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from rest_framework import status
from .serializers import RegisterSerializer, UserSerializer

class RegisterView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

class LoginView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        username = request.data.get('email')
        password = request.data.get('password')
        
        user = authenticate(username=username, password=password)
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': UserSerializer(user).data
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
```

## 7. URLs

In `products/urls.py`:

```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet

router = DefaultRouter()
router.register('', ProductViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
```

In `authentication/urls.py`:

```python
from django.urls import path
from .views import RegisterView, LoginView

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
]
```

In `ecommerce_backend/urls.py`:

```python
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/products/', include('products.urls')),
    path('api/auth/', include('authentication.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

## 8. Database Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

## 9. Create Superuser

```bash
python manage.py createsuperuser
```

## 10. Run the Server

```bash
python manage.py runserver
```

Now your Django API will be accessible at `http://localhost:8000/api/` and should work with the React frontend. You'll need to adjust the API_URL in `src/api/client.ts` to match this endpoint.
