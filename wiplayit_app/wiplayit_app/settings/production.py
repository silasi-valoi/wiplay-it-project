

from wiplayit_app.settings.common import *
import os

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False
SITE_ID = 4

ALLOWED_HOSTS  = os.getenv('ALLOWED_HOSTS') 
CORS_ORIGIN_WHITELIST = os.getenv("CORS_ORIGIN_WHITELIST")


EMAIL_USE_SSL = False
EMAIL_USE_TLS = True
EMAIL_PORT    = 25

EMAIL_HOST          = os.getenv("EMAIL_HOST")
EMAIL_HOST_USER     = os.getenv("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD")

TWILIO_ACCOUNT_SID  = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN   = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")
   

DEFAULT_FROM_EMAIL = EMAIL_HOST_USER
SERVER_EMAIL       = EMAIL_HOST_USER
EMAIL_FROM         = EMAIL_HOST_USER 

SECURE_SSL_REDIRECT = True


print(EMAIL_HOST,EMAIL_HOST_USER,EMAIL_HOST_PASSWORD)

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.getenv('DATABASE_NAME'),
        'USER': os.getenv("DATABASE_USER"),
        'PASSWORD': os.getenv("DATABASE_PASSWORD"),
        'HOST': os.getenv('DATABASE_HOST'),
        'PORT': '',
        'OPTIONS': {
        	'charset': 'utf8mb4',
        	'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        	},
        
    }
}



