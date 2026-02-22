# --- Stage 1: Build the Frontend ---
FROM node:20-alpine AS build-frontend
WORKDIR /app/frontend
# Note: Path is relative to the build context (root)
COPY sentianalyzer-main/package*.json ./
RUN npm install
COPY sentianalyzer-main/ ./
RUN npm run build

# --- Stage 2: Final Image (Python) ---
FROM python:3.10-slim
WORKDIR /app
 
# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code (assuming manage.py is in senti_ana/)
COPY senti_ana/ .

# Copy built frontend assets into a directory that Django can serve
# This will be used in settings.StaticFiles_DIRS
COPY --from=build-frontend /app/frontend/dist ./frontend_dist

# Collect static files (Django + React files)
# This will move everything to /app/staticfiles
RUN python manage.py collectstatic --noinput

# Expose port
EXPOSE 8000

# Run with Gunicorn for production-ready serving
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "senti_ana.wsgi:application"]
