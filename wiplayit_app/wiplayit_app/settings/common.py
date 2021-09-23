"""
Django settings for backend project.

Generated by 'django-admin startproject' using Django 2.2.4.

For more information on this file, see
https://docs.djangoproject.com/en/2.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.2/ref/settings/
"""

import os
import datetime
from dotenv import load_dotenv, find_dotenv

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

load_dotenv(find_dotenv())

SECRET_KEY = os.getenv('SECRET_KEY')


AUTH_USER_MODEL = 'app_backend.User'

GUARDIAN_MONKEY_PATH = False
ANONYMOUS_USER_NAME = "Anonymous"
GUARDIAN_GET_INIT_ANONYMOUS_USER = 'app_backend.registrations.models.get_anonymous_user_instance'

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'


ACCOUNT_USER_MODEL_USERNAME_FIELD = None
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_AUTHENTICATION_METHOD = 'email'

ACCOUNT_ADAPTER             = 'app_backend.registrations.adapter.CustomAccountAdapter'
SOCIALACCOUNT_AUTO_SIGNUP   = True
SOCIALACCOUNT_ADAPTER       = 'app_backend.registrations.adapter.CustomSocialAccountAdapter'
SOCIALACCOUNT_QUERY_EMAIL   = True
ACCOUNT_LOGOUT_ON_GET       = True
ACCOUNT_EMAIL_VERIFICATION  =  'optional'
ACCOUNT_LOGIN_ON_EMAIL_CONFIRMATION = True
ACCOUNT_CONFIRM_EMAIL_ON_GET = True
SOCIALACCOUNT_AVATAR_SUPPORT = True
ACCOUNT_DEFAULT_HTTP_PROTOCOL='https'



SOCIALACCOUNT_PROVIDERS = {
    'facebook': {
        'METHOD': 'oauth2',
        'SCOPE': ['email', 'public_profile', 'user_friends'],
        'AUTH_PARAMS': {'auth_type': 'reauthenticate'},
        'INIT_PARAMS': {'cookie': True},
        'FIELDS': [
            'id',
            'email',
            'name',
            'first_name',
            'last_name',
            'verified',
            'locale',
            'timezone',
            'link',
            'gender',
            'updated_time',
        ],
        'EXCHANGE_TOKEN': True,
        'LOCALE_FUNC': 'path.to.callable',
        'VERIFIED_EMAIL': False,
        'VERSION': 'v2.12',
        "APP": {
            "client_id": "<client_id>",
            "secret": "<secret>",
        },
    },
     'google': {
        'SCOPE': [
            'profile',
            'email',
        ],
        'AUTH_PARAMS': {
            'access_type': 'online',
        },

        "APP": {
            "client_id": "<client_id>",
            "secret": "<secret>",
        },
    }
}

APPEND_SLASH = True

AUTHENTICATION_BACKENDS = (

        'django.contrib.auth.backends.ModelBackend',
        'guardian.backends.ObjectPermissionBackend',
        'allauth.account.auth_backends.AuthenticationBackend',
        )

REST_FRAMEWORK = {
    'EXCEPTION_HANDLER': 'app_backend.helpers.custom_exception_handler',

    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_jwt.authentication.JSONWebTokenAuthentication',
        #'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication',
        ),

    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
        #'rest_framework.permissions.IsAdminUser',
   ),


}


REST_AUTH_SERIALIZERS = {
   'USER_DETAILS_SERIALIZER'   : 'app_backend.registrations.serializers.BaseUserSerializer',
   'TOKEN_SERIALIZER'          : 'app_backend.registrations.serializers.TokenSerializer',
   'PASSWORD_RESET_SERIALIZER' : 'app_backend.registrations.serializers.CustomPasswordResetSerializer',
   'PASSWORD_RESET_CONFIRM_SERIALIZER': 'app_backend.registrations.serializers.CustomPasswordResetConfirmSerializer',

}


REST_AUTH_REGISTER_SERIALIZERS = {
       
}

REST_USE_JWT       = True
REST_SESSION_LOGIN = True

JWT_AUTH = { 
    'JWT_AUTH_HEADER_PREFIX': 'JWT',
    'JWT_ALLOW_REFRESH'     : True,
    'JWT_EXPIRATION_DELTA': datetime.timedelta(days=365),
    'JWT_REFRESH_EXPIRATION_DELTA': datetime.timedelta(days=365),

    'JWT_RESPONSE_PAYLOAD_HANDLER': 'app_backend.registrations.views.jwt_response_payload_handler',
    
}

# Application definition


INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sites',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'app_backend',
    'rest_framework',
    'storages', 
    'rest_auth',
    'rest_auth.registration',
    'rest_framework.authtoken',
    'corsheaders',
    'webpack_loader',
    'twilio',
    'guardian',
    'mptt',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.facebook',
    'allauth.socialaccount.providers.google',
    'allauth.socialaccount.providers.twitter',
]




MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware'
    
]

CORS_ORIGIN_ALLOW_ALL = False


CORS_ALLOW_METHODS = (
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
)

CORS_ALLOW_HEADERS = (
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
)



TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR + "/templates/",],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'wiplayit_app.wsgi.application'

ROOT_URLCONF = 'wiplayit_app.urls'



# Password validation
# https://docs.djangoproject.com/en/2.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/2.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

USE_S3 = os.environ.get('USE_S3') == 'True'

if USE_S3:
    # aws settings
    AWS_ACCESS_KEY_ID = os.getenv('S3_BUCKET_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = os.getenv('S3_BUCKET_SECRET_ACCESS_KEY')
    AWS_STORAGE_BUCKET_NAME = os.getenv('AWS_STORAGE_BUCKET_NAME')
    AWS_S3_REGION_NAME = os.getenv('AWS_S3_REGION_NAME')
    AWS_DEFAULT_ACL = None
    AWS_S3_FILE_OVERWRITE = False
    AWS_S3_VERIFY = True
    AWS_S3_CUSTOM_DOMAIN = f'{AWS_STORAGE_BUCKET_NAME}.s3.{AWS_S3_REGION_NAME}.amazonaws.com'
    AWS_S3_OBJECT_PARAMETERS = {'CacheControl': 'max-age=86400'}

    STATIC_LOCATION = 'static'
    STATIC_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/{STATIC_LOCATION}/'
    
    STATICFILES_STORAGE = 'wiplayit_app.storage_backends.StaticStorage'

    # s3 public media settings
    PUBLIC_MEDIA_LOCATION = 'media'
    MEDIA_URL = f'https://{AWS_S3_CUSTOM_DOMAIN}/{PUBLIC_MEDIA_LOCATION}/'

    DEFAULT_FILE_STORAGE = 'wiplayit_app.storage_backends.PublicMediaStorage'

    # s3 private media settings
    PRIVATE_MEDIA_LOCATION = 'private'
    PRIVATE_FILE_STORAGE = 'wiplayit_app.storage_backends.PrivateMediaStorage'
   

else:
    STATIC_URL = '/static/'
    STATIC_ROOT = os.path.join(BASE_DIR, 'static')
    MEDIA_URL = '/media/'
    MEDIA_ROOT = os.path.join(BASE_DIR, 'media')


STATICFILES_DIRS = (os.path.join(BASE_DIR, 'static'),)


STATICFILES_FINDERS = "django.contrib.staticfiles.finders.AppDirectoriesFinder",


WEBPACK_LOADER = {
    'DEFAULT': {
            'BUNDLE_DIR_NAME': 'app_frontend/',
            'STATS_FILE': os.path.join(BASE_DIR, 'webpack-stats.json'),
    
    }
}

