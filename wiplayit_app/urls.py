"""wiplayit_app URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin

from django.urls import path, include, re_path
from app_backend.api_views.api_detail_views import index



urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('app_backend.urls.create_urls')),
    path('', include('app_backend.urls.update_urls')),
    path('', include('app_backend.urls.retrieve_urls')),
    path('', include('app_backend.admin_api.urls')),
    path('', include('app_backend.registrations.urls')),
    path('auth-admin/', include('django.contrib.auth.urls')),
    path('accounts/', include('allauth.urls')),
    path('rest-auth/', include('rest_auth.urls')),
    re_path(r'.*/', index),
  
]



