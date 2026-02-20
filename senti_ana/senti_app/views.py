from django.contrib.auth.models import User
from django.contrib.auth import authenticate

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

import tensorflow as tf
from keras.preprocessing.sequence import pad_sequences
import numpy as np
import pickle
import os
from django.conf import settings
from .utils import get_model_artifacts
from .models import SentimentAnalysis, UserProfile


# ─────────────────────────────────────────────
#  Helper: generate JWT token pair for a user
# ─────────────────────────────────────────────
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access":  str(refresh.access_token),
    }


# ─────────────────────────────────────────────
#  POST /api/auth/register/
# ─────────────────────────────────────────────
@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    """
    Register a new user.

    Request body (JSON):
        {
            "username": "john_doe",
            "email":    "john@example.com",
            "password": "StrongPass123!"
        }

    Returns:
        201 – user created + JWT token pair
        400 – validation error
    """
    username = request.data.get("username", "").strip()
    email    = request.data.get("email",    "").strip()
    password = request.data.get("password", "")

    # ── Validation ──────────────────────────────
    errors = {}

    if not username:
        errors["username"] = "Username is required."
    elif User.objects.filter(username=username).exists():
        errors["username"] = "A user with this username already exists."

    if not email:
        errors["email"] = "Email is required."
    elif User.objects.filter(email=email).exists():
        errors["email"] = "A user with this email already exists."

    if not password:
        errors["password"] = "Password is required."
    elif len(password) < 8:
        errors["password"] = "Password must be at least 8 characters long."

    if errors:
        return Response(
            {"success": False, "errors": errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # ── Create user ─────────────────────────────
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
    )

    tokens = get_tokens_for_user(user)

    return Response(
        {
            "success": True,
            "message": "User registered successfully.",
            "user": {
                "id":       user.id,
                "username": user.username,
                "email":    user.email,
            },
            "tokens": tokens,
        },
        status=status.HTTP_201_CREATED,
    )


# ─────────────────────────────────────────────
#  POST /api/auth/login/
# ─────────────────────────────────────────────
@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    """
    Authenticate an existing user and return JWT tokens.

    Request body (JSON):
        {
            "username": "john_doe",
            "password": "StrongPass123!"
        }

    Returns:
        200 – authenticated + JWT token pair
        400 – missing fields
        401 – invalid credentials
    """
    username = request.data.get("username", "").strip()
    password = request.data.get("password", "")

    # ── Validation ──────────────────────────────
    errors = {}
    if not username:
        errors["username"] = "Username is required."
    if not password:
        errors["password"] = "Password is required."

    if errors:
        return Response(
            {"success": False, "errors": errors},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # ── Authenticate ─────────────────────────────
    user = authenticate(request, username=username, password=password)

    if user is None:
        return Response(
            {"success": False, "message": "Invalid username or password."},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    tokens = get_tokens_for_user(user)

    return Response(
        {
            "success": True,
            "message": "Login successful.",
            "user": {
                "id":       user.id,
                "username": user.username,
                "email":    user.email,
            },
            "tokens": tokens,
        },
        status=status.HTTP_200_OK,
    )


# ─────────────────────────────────────────────
#  POST /api/auth/logout/
# ─────────────────────────────────────────────
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout(request):
    """
    Blacklist the refresh token to log the user out.

    Request body (JSON):
        {
            "refresh": "<refresh_token>"
        }

    Returns:
        200 – logged out successfully
        400 – invalid / missing token
    """
    refresh_token = request.data.get("refresh")

    if not refresh_token:
        return Response(
            {"success": False, "message": "Refresh token is required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        token = RefreshToken(refresh_token)
        token.blacklist()
    except TokenError as e:
        return Response(
            {"success": False, "message": str(e)},
            status=status.HTTP_400_BAD_REQUEST,
        )

    return Response(
        {"success": True, "message": "Logged out successfully."},
        status=status.HTTP_200_OK,
    )


# ─────────────────────────────────────────────
#  POST /api/auth/token/refresh/   (handled by simplejwt directly in urls.py)
# ─────────────────────────────────────────────

# ─────────────────────────────────────────────
#  GET /api/auth/me/   – protected example
# ─────────────────────────────────────────────
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    """
    Return the currently authenticated user's profile.
    Requires a valid Bearer access token in the Authorization header.
    """
    user = request.user
    return Response(
        {
            "success": True,
            "user": {
                "id":          user.id,
                "username":    user.username,
                "email":       user.email,
                "date_joined": user.date_joined,
                "last_login":  user.last_login,
            },
        },
        status=status.HTTP_200_OK,
    )


# ─────────────────────────────────────────────
#  Sentiment Prediction
# ────────────────────────────────────────────

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def predict(request):
    """
    Predict sentiment of the provided text and store the result.
    
    Request body (JSON):
        {
            "text": "I love this product!"
        }
    """
    text = request.data.get("text", "").strip()
    MAX_LEN = 100  # Should match the maxlen used during model training
    if not text:
        return Response(
            {"success": False, "message": "No text provided."},
            status=status.HTTP_400_BAD_REQUEST
        )

    model, tokenizer, classes = get_model_artifacts()
    
    if model is None or tokenizer is None:
        return Response(
            {"success": False, "message": "Sentiment model is not available."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    try:
        # ── Preprocess ──────────────────────────────
        sequences = tokenizer.texts_to_sequences([text])
        padded = pad_sequences(sequences, maxlen=MAX_LEN, padding='post', truncating='post')
        
        # ── Predict ─────────────────────────────────
        pred_probs = model.predict(padded)
        pred_label_idx = np.argmax(pred_probs, axis=1)[0]
        confidence = float(pred_probs[0][pred_label_idx])
        predicted_class = str(classes[pred_label_idx])
        
        probs_dict = {str(c): float(p) for c, p in zip(classes, pred_probs[0])}

        # ── Store in Database ────────────────────────
        # UserProfile is created via signals on User creation.
        user_profile = UserProfile.objects.get(user=request.user)
        SentimentAnalysis.objects.create(
            user_profile=user_profile,
            text=text,
            sentiment=predicted_class
        )
        
        return Response({
            "success": True,
            "sentiment": predicted_class,
            "confidence": confidence,
            "probabilities": probs_dict
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {"success": False, "message": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
