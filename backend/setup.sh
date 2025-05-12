
#!/bin/bash

# Create virtual environment
python -m venv env

# Activate virtual environment
source env/bin/activate  # On Windows: env\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Load initial data fixtures
python manage.py loaddata products/fixtures/initial_products.json

# Create superuser
echo "Creating superuser for Django admin..."
python manage.py createsuperuser

# Run the development server
python manage.py runserver
