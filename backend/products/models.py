
from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='products/', null=True, blank=True)
    in_stock = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name

class Order(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    shipping_address = models.TextField()
    billing_address = models.TextField()
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Order #{self.id} by {self.user.username}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    
    def __str__(self):
        return f"{self.quantity} x {self.product.name} in Order #{self.order.id}"

@receiver(post_save, sender=Order)
def order_notification(sender, instance, created, **kwargs):
    if created:
        try:
            # Send email to customer
            user_email = instance.user.email
            user_phone = instance.user.profile.phone if hasattr(instance.user, 'profile') else None
            
            # Email to customer
            customer_subject = f"Order Confirmation - Your Order #{instance.id} has been received"
            customer_message = f"""
                Dear {instance.user.profile.full_name if hasattr(instance.user, 'profile') else instance.user.username},
                
                Thank you for your order! We've received your order #{instance.id} and it's now being processed.
                
                Order Details:
                - Order ID: #{instance.id}
                - Total Amount: ${instance.total_amount}
                - Status: {instance.status}
                
                We'll notify you when your order ships.
                
                Thank you for shopping with us!
            """
            
            send_mail(
                customer_subject,
                customer_message,
                settings.DEFAULT_FROM_EMAIL,
                [user_email],
                fail_silently=False,
            )
            
            # Email to admin
            admin_emails = [admin[1] for admin in settings.ADMINS]
            if admin_emails:
                admin_subject = f"New Order Received - Order #{instance.id}"
                admin_message = f"""
                    A new order has been placed.
                    
                    Order Details:
                    - Order ID: #{instance.id}
                    - Customer: {instance.user.profile.full_name if hasattr(instance.user, 'profile') else instance.user.username}
                    - Email: {instance.user.email}
                    - Phone: {user_phone if user_phone else 'Not provided'}
                    - Total Amount: ${instance.total_amount}
                    - Status: {instance.status}
                    
                    Please process this order.
                """
                
                send_mail(
                    admin_subject,
                    admin_message,
                    settings.DEFAULT_FROM_EMAIL,
                    admin_emails,
                    fail_silently=False,
                )
            
            # Send SMS (would require integration with SMS provider)
            if user_phone:
                try:
                    # This is a placeholder - implement your SMS service integration here
                    logger.info(f"Would send SMS to {user_phone}: Order #{instance.id} received and being processed.")
                except Exception as e:
                    logger.error(f"Failed to send SMS notification: {str(e)}")
            
        except Exception as e:
            logger.error(f"Failed to send order notification: {str(e)}")
