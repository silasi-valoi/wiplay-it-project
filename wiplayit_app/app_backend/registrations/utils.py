import random
import copy
import phonenumbers
from phonenumbers import geocoder
from django.conf import settings
from django.core.cache import cache
from twilio.rest import Client
from django.core.validators import validate_email , RegexValidator
from django.core.exceptions import ValidationError
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.http import  HttpResponse, JsonResponse
from django.urls import reverse_lazy, reverse
from django.views.decorators.csrf import csrf_exempt, csrf_protect 
from rest_framework import serializers, exceptions



def signup_phone_number(request, user):
    pass

def phone_number_exists(phone_number, request=None, exclude_user=None):
    from .models import  PhoneNumber

    ret = PhoneNumber.objects.filter(primary_number__iexact=phone_number).exists()
        
    if not ret:
        ret = PhoneNumber.objects.filter(national_format__iexact=phone_number).exists()
    
    if not ret:
        ret = PhoneNumber.objects.filter(inter_format__iexact=phone_number).exists()
           
    if not ret:
        ret = PhoneNumber.objects.filter(user__email__iexact=phone_number).exists()

    return ret

def get_for_user(numbers, user):
    phone_numbers = numbers.filter(user=user)
    return phone_numbers


def get_phone_numbers(value, request=None):
    from .models import  PhoneNumber

    
    user = request and request.user    
    phone_number = PhoneNumber.objects.filter(primary_number=value)

    if not  phone_number:
        phone_number = PhoneNumber.objects.filter(national_format=value)

    if not phone_number:
        phone_number =  PhoneNumber.objects.filter(user__email=value)
        
    if not phone_number:
        phone_number = PhoneNumber.objects.filter(inter_format=value)

    return phone_number 


def get_verified_number(unique_key):
    phone_number = get_phone_numbers(unique_key)

    if phone_number:
        phone_number = phone_number
        return phone_number 
    return None

def email_is_verified(unique_key):
    from allauth.account.models import EmailAddress
    from .models import User
    email_address = EmailAddress.objects.filter(email__iexact=unique_key)
    users = User.objects.filter(email__iexact=unique_key)

    verified = False
    for email in email_address:
        if email.verified:
            verified = True

    for user in users:
        if user.is_confirmed:
            verified = True

    return verified


def username_exist(email_or_phone_num):
    is_taken = User.objects.filter(email__iexact=email_or_phone_num).exists()
    return is_taken


def _get_pin(length=6):
    pin = random.sample(range(10**(length-1),10**length), 1)[0]
    return pin

    

@csrf_exempt
def send_pin(phone_number, message_body=None):
    twiml = '<Response><Message>Hello!</Message></Response>'
    
    if not phone_number:
        return HttpResponse(twiml, content_type='text/xml')
    
    client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
    message = client.messages.create(body=message_body,
            to = phone_number,
            from_ = settings.TWILIO_PHONE_NUMBER, 
            )
    print(message)  
    HttpResponse("Message %s sent" % message.sid, content_type='text/xml', status=403)


def primary_number(country, phone_number):
    phone_number = parse_phone_number(country, phone_number)
    if is_valid_number(phone_number):
        pass

def is_using_phone_number(username):
    validator = get_username_validator(is_phone_number=True)
    #phonenumbers.is_valid_number(z)
    return validate_username(validator, username)

def is_using_email_address(username):
    validator = get_username_validator(is_email_address=True)
    return validate_username(validator, username)

def validate_username(validator, username):
    if not validator: return 

    try:
        validator(username)
        return True
    except  ValidationError as e:
        error = e
        return False

def get_username_validator(is_phone_number=False, is_email_address=False):
    validate_phone_number = RegexValidator(regex=r'^\+?[\d\s]+$')
    
    if is_phone_number:
        return validate_phone_number  
    elif is_email_address:
        if is_email_address:
            return validate_email
    return None

def parse_phone_number(country, phone_number):
    try:
        phone_number = phonenumbers.parse(phone_number, country)
        return phone_number
    except Exception as e:
        return None

def is_valid_number(country, phone_number):
    phone_number = parse_phone_number(country, phone_number)
    return phonenumbers.is_valid_number(phone_number)

def get_e164_number_format(country, phone_number):
    phone_number = parse_phone_number(country, phone_number)
    if phone_number:
        return phonenumbers.format_number(
                                phone_number, 
                                phonenumbers.PhoneNumberFormat.E164
                            )
    return None


def get_national_number_format(country, phone_number):
    phone_number = parse_phone_number(country, phone_number) 
     
    if phone_number:
        return phonenumbers.format_number(
                            phone_number,
                            phonenumbers.PhoneNumberFormat.NATIONAL)
    return None


def get_inter_number_format(country, phone_number):
    phone_number = parse_phone_number(country, phone_number)  
    if phone_number:
        return phonenumbers.format_number(
                            phone_number, 
                            phonenumbers.PhoneNumberFormat.INTERNATIONAL)
    return None

def get_phone_number_region(country, phone_number):
    
    phone_number = parse_phone_number(country, phone_number)
    country = geocoder.description_for_number(phone_number, "en")
    return country


