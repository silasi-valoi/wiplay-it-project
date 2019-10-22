"""
Django settings for backend project.

Generated by 'django-admin startproject' using Django 2.2.4.

For more information on this file, see
https://docs.djangoproject.com/en/2.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.2/ref/settings/
"""


from wiplayit_app.settings.common import *




# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
#SECRET_KEY = 't*=!z(-o4grk^=*w$!&1)9)c3-4pzlr0t-nr57rar=mkfvtno1'

# SECURITY WARNING: don't run with debug turned on in production!

DEBUG = True

INSTALLED_APPS.append('webpack_loader')
INSTALLED_APPS.append('coverage')


ALLOWED_HOSTS = [ '127.0.0.1', '192.168.43.14' ]


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'wiplayit_app',
        'USER': 'silasi',
        'PASSWORD': 'siLasi9018$?',
        'HOST': 'localhost',
        'PORT': '',
    }
}


WEBPACK_LOADER = {
    'DEFAULT': {
            'BUNDLE_DIR_NAME': 'dist/',
            'STATS_FILE': os.path.join(BASE_DIR, 'webpack-stats.json'),
            
            
        }
}


CORS_ORIGIN_WHITELIST = ['http://192.168.43.14:3000', 'http://localhost:3000' ]

