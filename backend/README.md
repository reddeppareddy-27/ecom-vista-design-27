
# E-commerce Backend API

This Django REST API serves as the backend for the e-commerce application.

## Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Run the setup script:
   ```
   bash setup.sh
   ```
   
   On Windows, you might need to run each command in the setup script manually.

3. The setup script will:
   - Create a virtual environment
   - Install dependencies
   - Run migrations
   - Load initial product data
   - Create a superuser for you
   - Start the development server

## API Endpoints

### Authentication

- `POST /api/auth/register/` - Register a new user
  - Required fields: username, email, password, full_name
  
- `POST /api/auth/login/` - Login an existing user
  - Required fields: email, password
  
- `POST /api/auth/token/refresh/` - Refresh authentication token
  - Required fields: refresh (token)
  
- `GET /api/auth/user/` - Get current user data (requires authentication)

### Products

- `GET /api/products/` - List all products
- `GET /api/products/{id}/` - Get a specific product
- `POST /api/products/` - Create a product (requires authentication)
- `PUT /api/products/{id}/` - Update a product (requires authentication)
- `DELETE /api/products/{id}/` - Delete a product (requires authentication)

## Admin Panel

Access the admin panel at: http://localhost:8000/admin/

Use the superuser credentials you created during setup to log in.
