from django.contrib import admin
from main_app.models import DefaultProfilePicture
from .models import *


class DefaultProfilePictureAdmin(admin.ModelAdmin):
	fields = ['profile_picture']

admin.site.register(DefaultProfilePicture, DefaultProfilePictureAdmin)


class UserAdmin(admin.ModelAdmin):
    fields = ['first_name', 'last_name', 'email', 
     		 'is_confirmed', 'is_active' , 'is_staff', 'is_superuser' ]

admin.site.register(User,UserAdmin)


class ProfileAdmin(admin.ModelAdmin):
    fields =['location', 'bio', 'profile_picture', 'followers', 'followings', 'user'
        ]

admin.site.register(Profile,ProfileAdmin)


class PhoneNumberAdmin(admin.ModelAdmin):
	list_display = ('phone_number', 'user', 'primary', 'verified')
	fields = ['user', 'inter_format','phone_number',
	          'national_format', 'verified', 'primary']

admin.site.register(PhoneNumber, PhoneNumberAdmin)


class PhoneNumberPasswordChangeAdmin(admin.ModelAdmin):
	fields = ['phone_number', 'sent', 'created', 'sms_code', 'password_changed']

admin.site.register(PhoneNumberPasswordChange, PhoneNumberPasswordChangeAdmin)



class PhoneNumberConfirmationAdmin(admin.ModelAdmin):
	fields = ['phone_number', 'sent', 'created', 'sms_code']

admin.site.register(PhoneNumberConfirmation, PhoneNumberConfirmationAdmin)



