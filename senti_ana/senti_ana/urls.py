"""
URL configuration for senti_ana project.
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),

    # Auth APIs  →  /api/auth/register/ , /api/auth/login/ , etc.
    path('api/auth/', include('senti_app.urls')),

    # Catch-all to serve the React Frontend (index.html)
    # This must be the last pattern
    re_path(r'^.*$', TemplateView.as_view(template_name="index.html"), name='index'),
]
