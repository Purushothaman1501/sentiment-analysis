from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from . import views

urlpatterns = [
    # ── Auth endpoints ──────────────────────────────────────────────────────
    path("register/", views.register, name="auth-register"),
    path("login/",    views.login,    name="auth-login"),
    path("logout/",   views.logout,   name="auth-logout"),

    # Refresh an access token using a valid refresh token
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),

    # Protected: returns the current user's profile
    path("me/", views.me, name="auth-me"),
]
