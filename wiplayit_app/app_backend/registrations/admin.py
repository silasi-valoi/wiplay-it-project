from django.contrib import admin
from django.contrib.auth.models import Group
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from mptt.admin import MPTTModelAdmin

from .models import *


class DefaultProfilePictureAdmin(admin.ModelAdmin):
	fields = ['profile_picture']

admin.site.register(DefaultProfilePicture, DefaultProfilePictureAdmin)


class Userdmin(admin.ModelAdmin):
    fields = ['first_name', 'last_name', 'email', 
     		 'is_confirmed', 'is_active' , 'is_staff', 'is_superuser' ]

admin.site.register(User,Userdmin)


class Priofiledmin(admin.ModelAdmin):
    fields =['live', 'credential', 'favorite_quote', 
            'profile_picture', 'followers', 'followings', 'user'
        ]

admin.site.register(Profile,Priofiledmin)


class PhoneNumberAdmin(admin.ModelAdmin):
	list_display = ('primary_number', 'user', 'primary', 'verified')
	fields = ['user', 'inter_format','primary_number',
	          'national_format', 'verified', 'primary']

admin.site.register(PhoneNumber, PhoneNumberAdmin)


class CountryAdmin(admin.ModelAdmin):
	fields = ['user', 'short_name', 'long_name']

admin.site.register(Country, CountryAdmin)



class PhoneNumberPasswordChangeAdmin(admin.ModelAdmin):
	fields = ['phone_number', 'sent', 'created', 'sms_code', 'password_changed']

admin.site.register(PhoneNumberPasswordChange, PhoneNumberPasswordChangeAdmin)



class PhoneNumberConfirmationAdmin(admin.ModelAdmin):
	fields = ['phone_number', 'sent', 'created', 'sms_code']

admin.site.register(PhoneNumberConfirmation, PhoneNumberConfirmationAdmin)



