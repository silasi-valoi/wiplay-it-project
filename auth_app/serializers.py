from ast import Try
from curses.ascii import EM
import email
import random
from sqlite3 import DatabaseError

import phonenumbers
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_text
from django.utils.http import urlsafe_base64_decode as uid_decoder

from django.utils.translation import ugettext_lazy as _
from django.contrib.auth import authenticate, get_user_model
from django.core.exceptions import ValidationError
from django.contrib.auth.forms import PasswordResetForm
from rest_framework import serializers, exceptions
from rest_framework.authtoken.models import Token
from django.contrib.sites.models import Site
try:
	from allauth.account.adapter import get_adapter 
	from allauth.account.utils import setup_user_email
	from allauth.account.models import EmailAddress
	from allauth.account import app_settings as allauth_settings
	from allauth.utils import (email_address_exists)

except ImportError:
	raise ImportError("allauth needs to be added to INSTALLED_APPS.")

from rest_auth.serializers import (LoginSerializer,
								    PasswordResetConfirmSerializer, 
								   PasswordResetSerializer)
from rest_auth.registration.serializers import RegisterSerializer

from main_app.models import Question, Post, Answer
from .models import  (
					User,
					Profile,
					PhoneNumber,
					PhoneNumberConfirmation,
					PhoneNumberPasswordChange)
from main_app.mixins.serializer_mixins import SerialiizerMixin
from main_app import serializers  as app_serializers
from main_app.utils import  has_perm, get_users_with_permissions
from auth_app.utils import (is_using_phone_number,
								is_using_email_address,
								get_phone_numbers,
								get_for_user,
								phone_number_exists,
								is_valid_number,
								get_e164_number_format)


UserModel = get_user_model()

		

class EmailAddressSerializer(serializers.Serializer):
	email = serializers.EmailField(required=True, allow_blank=False)

	def get_queryset(self):
		return EmailAddress.objects.all()

	def get_email_address(self, request):
		try:
			return EmailAddress.objects.get(user=request.user, email=request.data['email'])
			
		except EmailAddress.DoesNotExist:
			msg = _('Email address does not exist or it has been deleted.')
			raise serializers.ValidationError(msg)
				
	
	def email_address_exists(self, email):
		return EmailAddress.objects.filter(user=self.request.user, email=email).exists()
		

	def add_email_address(self, email):
		user  = self.request.user
		email_address = EmailAddress.objects.add_email(
												self.request,
												user,
												email,
               									confirm=True,
											)

		return email_address

	
	def save(self, request):
		self.request = request
		
		email = self.validated_data.get('email')
		if self.email_address_exists(email):
			emails = EmailAddress.objects.filter(user=request.user, email=email)
								
			return emails[0]
		
		return None


class PhoneNumberSerializer(serializers.Serializer):
	phone_number = serializers.CharField(required=True, allow_blank=False)
	country_code = serializers.CharField(required=False, allow_blank=True)
	country_name = serializers.CharField(required=False, allow_blank=True)
	dial_code = serializers.CharField(required=False, allow_blank=True)
	format = serializers.CharField(required=False, allow_blank=True)

	def get_phone_number(self):
		pass
	
	def send_confirmation(self, phone_numbers, request=None):
		if phone_numbers:
			for number in phone_numbers:
				if not number.verified:
					number.send_confirmation(request)

	def add_phone_number(self, request):
		data = self.get_cleaned_data()

		phone_number = PhoneNumber.objects.add_phone_number(
												request,
												request.user,
												data,
               									confirm=True,
											)
		return phone_number

	def validate(self, data):
		return data

	def save(self, request):
		self.request = request
		phone_number = self.validated_data.get('phone_number')
						
		if phone_number_exists(phone_number) and request.user.is_authenticated:
			phone_numbers = get_phone_numbers(phone_number, request)
			phone_numbers = get_for_user(phone_numbers, request.user)
				
			return phone_numbers[0] if phone_numbers else None
							
		return None

	def get_cleaned_data(self):
							
		return {
            'phone_number' : self.validated_data.get('phone_number', ''),
            'country_name' : self.validated_data.get('country_name', ''),
            'country_code' : self.validated_data.get('country_code', ''),
            'format' : self.validated_data.get('format', ''),
            'dial_code' : self.validated_data.get('dial_code', '') 
        }


class CustomLoginSerializer(LoginSerializer):
	username = None
	email    = serializers.CharField(required=False, allow_blank=True)
	password = serializers.CharField(style={'input_type': 'password'})
	
	def _validate_phone_number(self, phone_number:str, password):
		phone_number = phone_number.replace(" ", '')	
		
		if not phone_number_exists(phone_number):
			msg = _('Account with this phone number does not exists')
			raise serializers.ValidationError(msg)

		phone_numbers = get_phone_numbers(phone_number)
		unique_username = None
		
		for phone_number in phone_numbers:
			unique_username = phone_number.user.email
												
		user = authenticate(email=unique_username, password=password)
		return user

	def _validate_email(self, email, password):
		user = None
		if not email_address_exists(email):
			msg = _('Account with this email address does not exists.')
			raise serializers.ValidationError(msg)

		user = authenticate(email=email, password=password)
		return user

	def validate(self, attrs):
		email    = attrs.get('email')
		password = attrs.get('password')
		self.is_phone_number  = is_using_phone_number(email)
		self.is_email_address = is_using_email_address(email)

		user     = None
		if self.is_email_address:
			user = self._validate_email(email, password)

		if self.is_phone_number:
			user = self._validate_phone_number(email, password)

		# Did we get back an user?
		self.can_authenticate(user)
		
		attrs['user'] = user
		return attrs

	def can_authenticate(self, user):
		if not user:
			msg = _('Unable to log in with provided credentials.')
			raise exceptions.ValidationError(msg)

		if  not user.is_active:
			msg = _('User account is disabled.')
			raise exceptions.ValidationError(msg)


class BaseRegisterSerializer(RegisterSerializer):
	username   = None
	password1  = None
	password2  = None
	email = serializers.CharField(required=False, allow_blank=True)
	first_name = serializers.CharField(required=True)
	last_name  = serializers.CharField(required=True)
	password = serializers.CharField(write_only=True)

	def validate_password(self, password):
		return get_adapter().clean_password(password)

	def validate(self, data):
		return data

	
class RegisterPhoneNumberSerializer(BaseRegisterSerializer, PhoneNumberSerializer):
	
	def validate_country_code(self, country_code=None):
		if not country_code:
			msg = _("Country code is invalid.")
			raise serializers.ValidationError(msg)

		self.country_code = country_code.upper()

		return self.country_code
	
	def validate_phone_number(self, phone_number=None):
		data = self.get_initial()
		
		self.country_code =  data.get('country_code', '').upper()

		if not self.country_code:
			msg = _("Country code is invalid.")
			raise serializers.ValidationError(msg)

		
		if not is_valid_number(self.country_code, phone_number):
			msg = _("Phone number is invalid.")
			raise serializers.ValidationError(msg)

		
		self.phone_number = get_e164_number_format(self.country_code, phone_number) 
			
		if allauth_settings.UNIQUE_EMAIL:
			
			if phone_number_exists(self.phone_number):
				msg = _("A user is already registered with this phone number.")
				raise serializers.ValidationError(msg)

		return phone_number

	
	def custom_signup(self, request, user):
		data = self.get_cleaned_data()
		
		phone_number = PhoneNumber.objects.add_phone_number(
												request,
												user,
												data,
               									confirm=True,
               									signup=True
											)
		
		return user


	def get_cleaned_data(self):
		
		super(BaseRegisterSerializer, self).get_cleaned_data()
		username =  self.validated_data.get('email', self.phone_number)
					
		return {
            'first_name' : self.validated_data.get('first_name', ''),
            'last_name'  : self.validated_data.get('last_name', ''),
            'email'      : self.phone_number,
            'password'   : self.validated_data.get('password', ''),
            'phone_number' : username,
            'country_name' : self.validated_data.get('country_name', ''),
            'country_code' : self.validated_data.get('country_code', ''),
            'format' : self.validated_data.get('format', ''),
            'dial_code' : self.validated_data.get('dial_code', '')
        }


class RegisterEmailSerializer(BaseRegisterSerializer):
	email = serializers.CharField(required=True)
	
	def get_cleaned_data(self):
		
		super(RegisterEmailSerializer, self).get_cleaned_data()
	
		return {
            'first_name' : self.validated_data.get('first_name', ''),
            'last_name' : self.validated_data.get('last_name', ''),
            'email' :  self.validated_data.get('email', ''),
            'password' : self.validated_data.get('password', ''),
		}
		

class TokenSerializer(serializers.ModelSerializer):

    class Meta:
        model = Token
        fields = ('key', 'user')

	

class SmsCodeSerializer(serializers.Serializer):
	sms_code = serializers.CharField(required=True)

	def validate(self, attrs):
		code = attrs.get('sms_code')
		sms_code = self.validate_code(code)
    	
		if not sms_code:
			msg = 'Code is invalid or it is expired'
			raise serializers.ValidationError(msg)

		if sms_code.code_expired():
			msg = 'Code expired'
			raise serializers.ValidationError(msg)

		attrs['sms_code'] = code
		return attrs

class PhoneNumberConfirmationSerializer(SmsCodeSerializer):
	
	def validate_code(self, value):
		confirmation = PhoneNumberConfirmation.objects.filter(sms_code=value)
		
		if not confirmation:
			return None

		return confirmation[0]


class PasswordChangeConfirmationSerializer(SmsCodeSerializer):

	def validate_code(self, value):
		confirmation = PhoneNumberPasswordChange.objects.filter(
			sms_code=value, password_changed=False
		)

		if not confirmation:
			return None
				
		return confirmation[0]
	

class AccountConfirmationResendSerializer(serializers.Serializer):
	email = serializers.CharField(required=False, allow_blank=True)

	def _validate_email(self, email):
		if not email_address_exists(email):
			msg = _('Account with this email address does not exist.')
			raise serializers.ValidationError(msg)

		return EmailAddress.objects.get(email=email).user	

	def validate(self, attrs):
		value = attrs.get('email')
		user = self._validate_email(value)
		attrs['user'] = user

		return attrs


class CustomPasswordResetForm(PasswordResetForm):

	def get_users(self, email):
		email_field_name = UserModel.get_email_field_name()

		return UserModel._default_manager.filter(**{
            '%s__iexact' % email_field_name: email,
            'is_active': True,
            'is_confirmed':True,
        })
        
	

class CustomPasswordResetSerializer(PasswordResetSerializer):
	email = serializers.CharField()
	

	def validate_phone_number(self, value):
		phone_number = value
		if not phone_number_exists(phone_number):
			msg = _('Account with this phone number does not exists.')
			raise serializers.ValidationError(msg)

		self.phone_number =  self.get_unique_phone_number(value)
		#if self.phone_number and not self.phone_number.verified:
		#	msg = _('You must confirm your account before you can change a password.')
		#	raise serializers.ValidationError(msg)
						
		return value

	def send_password_rest_code(self, request=None):
		self.phone_number.send_password_rest()

	def get_unique_phone_number(self, value):
		
		phone_numbers = get_phone_numbers(value)

		for number in phone_numbers:
			if number:
				unique_username = number.user.email

				if is_using_phone_number(unique_username):
					return number
		return None
	
	def get_unique_user(self, value):
		
		user = User.objects.filter(email=value)
		if user:
			return user[0]
	
		return None

	def validate_email(self, value):
		# Create PasswordResetForm with the serializer
		email = value
		self.is_phone_number = is_using_phone_number(value)
		if self.is_phone_number:
			return self.validate_phone_number(value)
			
		if not email_address_exists(email):
			msg = _('Account with this email address does not exists.')
			raise serializers.ValidationError(msg)

		#if  not email_is_verified(email):
		#	msg = _('You must confirm your account before you can change a password.')
		#	raise serializers.ValidationError(msg)

		self.reset_form = CustomPasswordResetForm(data=self.initial_data)
		if not self.reset_form.is_valid():
			raise serializers.ValidationError(self.reset_form.errors)

		return value

	def validate(self, attrs):
		
		if hasattr(self, 'phone_number'):
			attrs['phone_number'] = self.phone_number

		return attrs

	def save(self):
		request = self.context.get('request')

		if self.is_phone_number:
			return self.send_password_rest_code()
		
		# Set some values to trigger the send_email method.
		opts = {
            'use_https': request.is_secure(),
            'from_email': getattr(settings, 'DEFAULT_FROM_EMAIL'),
            'request': request,
            'email_template_name' : 'password_reset_email.html',
        }
		opts.update(self.get_email_options())
		self.reset_form.save(**opts)  



class CustomPasswordResetConfirmSerializer(PasswordResetConfirmSerializer):
	uid = serializers.CharField(required=False, allow_blank=True)
	token = serializers.CharField(required=False, allow_blank=True)
	sms_code = serializers.CharField(required=False, allow_blank=True)
	

	def _validate_uid(uid):
		pass

	def validate_token_based(self, attrs):
		self._errors = {}
		# Decode the uidb64 to uid to get User object

		msg = _('Unable to change password. This link may be broken or expired.')

		try:
			uid = force_text(uid_decoder(attrs['uid']))
			self.user = UserModel._default_manager.get(pk=uid)

		except (TypeError, ValueError, OverflowError, UserModel.DoesNotExist):
			raise ValidationError(msg)

		self.custom_validation(attrs)

		# Construct SetPasswordForm instance
		self.set_password_form = self.set_password_form_class(user=self.user, data=attrs)

		if not self.set_password_form.is_valid():
			raise serializers.ValidationError(self.set_password_form.errors)

		if not default_token_generator.check_token(self.user, attrs['token']):
			raise ValidationError(msg)

		return attrs

	def validate_sms_code_based(self, attrs):
		code = attrs.get('sms_code')
		password_change = PhoneNumberPasswordChange.objects.filter(sms_code=code)

		if password_change:
			password_change = password_change[0]
			if not password_change.password_changed:
				phone_number = password_change.phone_number
				self.user = phone_number.user
				
			else:
				raise ValidationError({'sms_code': ['Invalid code']})
		else:
			raise ValidationError({'sms_code': ['Invalid code']})

		self.custom_validation(attrs)
		# Construct SetPasswordForm instance
		self.set_password_form = self.set_password_form_class(user=self.user, data=attrs)
		if not self.set_password_form.is_valid():
			raise serializers.ValidationError(self.set_password_form.errors)

		password_change.confirm()

		return attrs

	def custom_validation(self, attrs):
		pass

	def validate(self, attrs):
	
		if attrs.get('uid') and attrs.get('token'):
			self.validate_token_based(attrs)

		elif attrs.get('sms_code'):
			self.validate_sms_code_based(attrs)

		else:
			msg = _('Could not change Password.')
			raise ValidationError(msg)

		return attrs
	

class PhoneNumberModelSerializer(serializers.ModelSerializer):
	
	class Meta:
		model = PhoneNumber 
		fields = '__all__'


class EmailAddressModelSerializer(serializers.ModelSerializer):
	
	class Meta:
		model = EmailAddress 
		fields = '__all__'


class ProfileSerializer(serializers.ModelSerializer):
	class Meta:
		model = Profile 
		fields = '__all__'

			    
class BaseUserSerializer(SerialiizerMixin, serializers.ModelSerializer):
	profile  = ProfileSerializer(read_only=False)
	phone_numbers = serializers.SerializerMethodField()
	email_address = serializers.SerializerMethodField()
	
	class Meta():
		model  = User
		fields = '__all__'
		extra_kwargs = {'password' : {'write_only': True}, }

	def get_email_address(self, obj):
		email_address = obj.emailaddress_set.all()

		return EmailAddressModelSerializer(email_address, many=True).data

	def get_phone_numbers(self, obj):
		phone_numbers = obj.phone_numbers.all()
		return PhoneNumberModelSerializer(phone_numbers, many=True).data
		
		                
	def update(self, instance, validated_data):
		profile_data = validated_data.pop('profile')
		# Unless the application properly enforces that this field is
		# always set, the follow could raise a `DoesNotExist`, which
		# would need to be handled.
				
		profile = instance.profile
		instance.first_name = validated_data.get('first_name', instance.first_name)
		instance.last_name  = validated_data.get('last_name', instance.last_name)  
		instance.save()

		profile.followers = profile_data.get(
			    'followers',	profile.followers
			)

		
		profile.live = profile_data.get(
			    'location',	profile.location
			)

		profile.bio = profile_data.get(
     		'bio',  profile.bio

			)

		profile.profile_picture = profile_data.get(
     		'profile_picture',  profile.profile_picture

			)

		profile.save()
		return instance	


class UserSerializer(BaseUserSerializer):
	user_is_following = serializers.SerializerMethodField()
	user_can_edit     = serializers.SerializerMethodField()
				                
	def get_user_is_following(self, obj):
		self.update_serializer_obj_perms('user_perms')
		
		if not self.current_user().is_authenticated:
			return False
		
		perms = self.get_obj_permissions('followers_perms')
		return has_perm(self.current_user(), perms, obj)	  
	

class UserProfileSerializer(UserSerializer):
	questions    = serializers.SerializerMethodField()
	posts        = serializers.SerializerMethodField()
	answers      = serializers.SerializerMethodField()
	followers    = serializers.SerializerMethodField()
	followings   = serializers.SerializerMethodField()
               
	def get_questions(self, obj):
		questions  =  Question.objects.filter(author=obj)
		self.update_serializer_obj_perms('question_perms')
		return app_serializers.QuestionSerializer(questions, context=self.context, many=True).data
	  
	def get_posts(self, obj):
		posts  =  Post.objects.filter(author=obj)
		self.update_serializer_obj_perms('post_perms')
		return app_serializers.PostSerializer(posts, context=self.context ,many=True).data
		
	def get_answers(self, obj):
		answers  =  Answer.objects.filter(author=obj)
		self.update_serializer_obj_perms('answer_perms')
		return app_serializers.AnswerReadSerializer(answers, context=self.context ,many=True).data
		  
	def get_followers(self, obj):
		users  = get_users_with_permissions(obj,  "change_user_followers")
		self.update_serializer_obj_perms('user_perms')
		return UserSerializer(users, context=self.context ,many=True).data
	  
	def get_followings(self, obj):
		users  = get_users_with_permissions(obj, "change_user_followings")
		self.update_serializer_obj_perms('user_perms')
		return  UserSerializer(users,context=self.context , many=True).data 

