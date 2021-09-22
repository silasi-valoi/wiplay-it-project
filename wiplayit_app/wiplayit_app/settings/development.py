
from wiplayit_app.settings.common import *
import os


DEBUG = True
SITE_ID = 3

EMAIL_USE_TLS = True
EMAIL_USE_SSL = False
EMAIL_PORT =  587


EMAIL_HOST          = os.getenv("DEV_EMAIL_HOST")
EMAIL_HOST_USER     = os.getenv("DEV_EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = os.getenv("DEV_EMAIL_HOST_PASSWORD")

DEFAULT_FROM_EMAIL = EMAIL_HOST_USER
SERVER_EMAIL       = EMAIL_HOST_USER
EMAIL_FROM         = EMAIL_HOST_USER 

TWILIO_ACCOUNT_SID  = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN   = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")

INSTALLED_APPS.append('coverage')
ALLOWED_HOSTS=['127.0.0.1', '192.168.43.14', '192.168.43.15', 'localhost']


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'db',
        'USER': 'root',
        'PASSWORD': 'sila9020@?',
        'HOST': 'wiplayit_app_db_1',
        'PORT': '3307',
    }
}


CORS_ORIGIN_WHITELIST = [
     'http://192.168.43.101:3000',
     'http://127.0.0.1:8000',
     'http://192.168.43.14:8000',
     'http://localhost:8000', 
     'http://baloyi.pythonanywhere.com',
     'https://baloyi.pythonanywhere.com',
     'https://valoi.pythonanywhere.com',
     'http://valoi.pythonanywhere.com', 
     'https://silasi.pythonanywhere.com',

    ]



