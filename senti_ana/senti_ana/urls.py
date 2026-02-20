"""
URL configuration for senti_ana project.
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    # Auth APIs  →  /api/auth/register/ , /api/auth/login/ , etc.
    path('api/auth/', include('senti_app.urls')),
]
