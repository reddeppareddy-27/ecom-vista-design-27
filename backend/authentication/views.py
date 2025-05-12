
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.conf import settings
from django.utils.crypto import get_random_string
from .serializers import RegisterSerializer, UserSerializer
from .models import UserProfile, PasswordResetToken
import uuid
import logging

logger = logging.getLogger(__name__)

class RegisterView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Save phone number if provided
        if 'phone' in request.data:
            profile = user.profile
            profile.phone = request.data['phone']
            profile.save()
        
        # Generate tokens for the new user
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'User registered successfully',
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            },
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        # Try to find user by email
        try:
            username = User.objects.get(email=email).username
        except User.DoesNotExist:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        
        user = authenticate(username=username, password=password)
        
        if user:
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'token': str(refresh.access_token),
                'refresh': str(refresh),
                'user': UserSerializer(user).data
            })
            
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class UserView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)

class PasswordResetRequestView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        email = request.data.get('email')
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Don't reveal that the email doesn't exist
            return Response({'message': 'If your email exists in our system, you will receive a password reset link'})
        
        # Generate unique token
        token = uuid.uuid4().hex
        
        # Save token to database
        PasswordResetToken.objects.create(user=user, token=token)
        
        # Send email with reset link
        try:
            reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token}"
            send_mail(
                'Password Reset Request',
                f'Click the following link to reset your password: {reset_url}',
                settings.DEFAULT_FROM_EMAIL,
                [email],
                fail_silently=False,
            )
        except Exception as e:
            logger.error(f"Failed to send password reset email: {str(e)}")
            return Response({'error': 'Failed to send email'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response({'message': 'If your email exists in our system, you will receive a password reset link'})

class PasswordResetConfirmView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        token = request.data.get('token')
        password = request.data.get('password')
        
        if not token or not password:
            return Response({'error': 'Token and password are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            reset_token = PasswordResetToken.objects.get(token=token, used=False)
        except PasswordResetToken.DoesNotExist:
            return Response({'error': 'Invalid or expired token'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if token is not older than 24 hours
        from django.utils import timezone
        from datetime import timedelta
        
        if timezone.now() - reset_token.created_at > timedelta(hours=24):
            return Response({'error': 'Token expired'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Update user password
        user = reset_token.user
        user.set_password(password)
        user.save()
        
        # Mark token as used
        reset_token.used = True
        reset_token.save()
        
        return Response({'message': 'Password has been reset successfully'})

class SendNotificationView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        recipient_email = request.data.get('email')
        recipient_phone = request.data.get('phone')
        subject = request.data.get('subject')
        message = request.data.get('message')
        
        # Send email notification
        try:
            if recipient_email:
                send_mail(
                    subject,
                    message,
                    settings.DEFAULT_FROM_EMAIL,
                    [recipient_email],
                    fail_silently=False,
                )
        except Exception as e:
            logger.error(f"Failed to send email notification: {str(e)}")
        
        # Send SMS notification (would require integration with SMS provider)
        # This is a placeholder - you'd need to implement your SMS service integration here
        if recipient_phone:
            try:
                self.send_sms(recipient_phone, message)
            except Exception as e:
                logger.error(f"Failed to send SMS notification: {str(e)}")
        
        return Response({'message': 'Notifications sent successfully'})
    
    def send_sms(self, phone_number, message):
        # Implement your SMS service integration here
        # For example, using Twilio:
        """
        from twilio.rest import Client
        
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        message = client.messages.create(
            body=message,
            from_=settings.TWILIO_PHONE_NUMBER,
            to=phone_number
        )
        """
        # For now, just log that we would send an SMS
        logger.info(f"Would send SMS to {phone_number}: {message}")
