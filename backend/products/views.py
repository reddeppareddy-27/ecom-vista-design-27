
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.core.mail import send_mail
from django.conf import settings
from .models import Product, Order
from .serializers import ProductSerializer, OrderSerializer
import logging

logger = logging.getLogger(__name__)

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        # Admins can see all orders, users can only see their own
        if user.is_staff:
            return Order.objects.all().order_by('-created_at')
        return Order.objects.filter(user=user).order_by('-created_at')
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        
        # Order notification is handled by the signal in models.py
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """Update order status and notify customer"""
        order = self.get_object()
        new_status = request.data.get('status')
        
        if not new_status:
            return Response({'error': 'Status is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        order.status = new_status
        order.save()
        
        # Send notification email to customer about status change
        try:
            subject = f"Order #{order.id} Status Update"
            message = f"""
                Dear {order.user.profile.full_name if hasattr(order.user, 'profile') else order.user.username},
                
                Your order #{order.id} status has been updated to: {order.get_status_display()}
                
                Thank you for shopping with us!
            """
            
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [order.user.email],
                fail_silently=False,
            )
            
            # Send SMS notification if phone number available
            if hasattr(order.user, 'profile') and order.user.profile.phone:
                try:
                    # This is a placeholder - implement your SMS service integration here
                    logger.info(f"Would send SMS to {order.user.profile.phone}: Order #{order.id} status updated to {order.get_status_display()}")
                except Exception as e:
                    logger.error(f"Failed to send SMS notification: {str(e)}")
        
        except Exception as e:
            logger.error(f"Failed to send status update notification: {str(e)}")
        
        return Response(OrderSerializer(order).data)
