"""
Django settings for backend project.

Generated by 'django-admin startproject' using Django 2.2.4.

For more information on this file, see
https://docs.djangoproject.com/en/2.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.2/ref/settings/
"""

from wiplayit_app.settings.common import *
import smtplib

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
#SECRET_KEY = 't*=!z(-o4grk^=*w$!&1)9)c3-4pzlr0t-nr57rar=mkfvtno1'

# SECURITY WARNING: don't run with debug turned on in production!
#01010111 01000101 01001100 01000011 01001111 01001101 01000101
#206367499
#1990

DEBUG = True
SITE_ID = 3


EMAIL_USE_TLS = True
EMAIL_USE_SSL = False

EMAIL_HOST          = 'smtp.gmail.com'
EMAIL_HOST_USER     = 'silassibaloy@gmail.com'
EMAIL_HOST_PASSWORD = 'SilasiBaloyi9020@?'


INSTALLED_APPS.append('coverage')
ALLOWED_HOSTS = [ '127.0.0.1', '192.168.43.14', 'localhost' ]


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'wiplayit_app',
        'USER': 'silasi',
        'PASSWORD': 'sila9020@?',
        'HOST': 'localhost',
        'PORT': '',
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

CORS_ORIGIN_WHITELIST = ['http://192.168.43.14:3000', 'http://localhost:3000' ]

