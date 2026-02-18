from django.apps import AppConfig


class SentiAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'senti_app'

    def ready(self):
        import senti_app.signals
