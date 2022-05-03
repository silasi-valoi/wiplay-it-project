import os
from wiplayit_app.settings.common import *


DEBUG = True
SITE_ID = 3

EMAIL_USE_TLS = True
EMAIL_USE_SSL = False
EMAIL_PORT =  587

EMAIL_HOST          = os.getenv("DEV_EMAIL_HOST")
EMAIL_HOST_USER     = os.getenv('AWS_SES_EMAIL_HOST_USER') #os.getenv("DEV_EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = os.getenv("DEV_EMAIL_HOST_PASSWORD")

DEFAULT_FROM_EMAIL = EMAIL_HOST_USER
SERVER_EMAIL       = EMAIL_HOST_USER
EMAIL_FROM         = EMAIL_HOST_USER 

TWILIO_ACCOUNT_SID  = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN   = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")
'''
LOGGING = {
    
    'handlers': {
        
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        
        'werkzeug': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}
'''

INSTALLED_APPS.append('coverage')
INSTALLED_APPS.append('django_extensions')
ALLOWED_HOSTS=['127.0.0.1', '192.168.43.14', '192.168.43.15', 'localhost']


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.getenv('DATABASE_NAME'),
        'USER': os.getenv('DATABASE_USER'),
        'PASSWORD': os.getenv('DATABASE_PASSWORD'),
        'HOST': os.getenv('DATABASE_HOST'),
        'PORT': '', #os.getenv('DATABASE_PORT'),
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

