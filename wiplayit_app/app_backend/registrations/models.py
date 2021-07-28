import datetime
from PIL import Image

from django.utils import timezone
from django.db import models
from django.conf import settings
from django.dispatch import receiver
from django.contrib.auth.models import PermissionsMixin
from django.utils.translation import gettext_lazy as _
from django.db.models.signals import post_save


from allauth.account.adapter import get_adapter
from guardian.mixins import GuardianUserMixin
from guardian.shortcuts import assign_perm
from django.contrib.auth.base_user import AbstractBaseUser

from .managers import UserManager, PhoneNumberManager
from app_backend.slug_generator import generate_unique_slug
from app_backend.registrations.utils import (_get_pin,
                                send_pin,
                                get_national_number_format,
                                get_inter_number_format,
                                get_phone_number_region)
 

class User(AbstractBaseUser, PermissionsMixin, GuardianUserMixin):
    email         = models.CharField(
                        verbose_name='email or phone number', 
                        max_length=50, 
                        unique=True
                        )

    first_name      = models.CharField('first name', max_length=15,blank=True)
    last_name       = models.CharField('last name', max_length=15,blank=True)
    date_joined     = models.DateTimeField('date joined', auto_now_add=True)
    slug            = models.SlugField('slug', max_length=50, unique=True, blank=True) 
    is_active       = models.BooleanField('active',default=True)
    is_staff        = models.BooleanField('staff', default=False)
    is_confirmed    = models.BooleanField('Is confirmed', default=False)
    country         = models.CharField(max_length=50, null=True)
        
    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []


    class Meta:
        db_table = "users" 
        permissions = (
                ("change_user_followers", "Can Profile Followers"),
                ("change_user_followings", "Can User Followings"),
            )

           
    def get_my_token(self):
        return Token.objects.get(user=self.user)
    my_token = property(get_my_token) 
        

    def get_full_name(self):
        full_name = '{0} {1}'.format(self.first_name, self.last_name)
        return full_name.strip()

    def get_short_name(self):
        return self.first_name
    

    def save(self, *args, **kwargs):
        slug_exist = self.__class__.objects.filter(slug=self.slug).exists()
        if not self.slug or not slug_exist:
            self.slug = generate_unique_slug(self.__class__, self.get_full_name())
              
        super().save() 

    def confirm(self, request=None):
        if not self.is_confirmed:
            self.is_confirmed = True
            self.save()        


def get_anonymous_user_instance(CustomUser):
    user, _  = User.objects.get_or_create(first_name="Anonymous")
    return user

class Profile (models.Model):
    live            = models.CharField(max_length=100, blank=True)
    credential      = models.CharField(max_length=150, blank=True)
    favorite_quote  = models.TextField(max_length=200, blank=True)
    profile_picture = models.ImageField(
                        upload_to='profiles/%y/%m/%d/',
                        blank=True,
                        default="default-profiles/user-image-placeholder.png"
                      )
    followers       = models.IntegerField(default=0)
    followings      = models.IntegerField(default=0)
    
    user            = models.OneToOneField(settings.AUTH_USER_MODEL,
                       on_delete= models.CASCADE, related_name="profile"
                        ,verbose_name='list of users', blank=True)


    def __str__(self):
        return (self.user.email)


    def save(self, *args, **kwargs):
        super().save()

    class Meta:
        db_table = "profiles"
        
        


       
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_profile(sender, instance, created, **kwargs):

    first_name = instance.get_short_name()
    if created and not kwargs.get('raw', False):

        profile = Profile(user=instance)

        if first_name != settings.ANONYMOUS_USER_NAME:
            profile.save()
            
            assign_perm("change_user", instance,  instance)
            assign_perm("delete_user", instance,  instance)




class PhoneNumber (models.Model):
    primary_number  = models.CharField(max_length=50, null=True)
    national_format = models.CharField(max_length=50, null=True)
    inter_format    = models.CharField(max_length=50, null=True)
    verified        = models.BooleanField(default=False)
    primary         = models.BooleanField(default=False)
    user            = models.ForeignKey(settings.AUTH_USER_MODEL,
                             verbose_name=_('user'),
                             related_name='phone_numbers',
                             on_delete=models.CASCADE,
                             blank=True)
    

    objects = PhoneNumberManager()

    def __str__(self):
        return (self.user.email)
    
    def save(self, *args, **kwargs):
        super().save()

    class Meta:
        db_table = 'users_phone_numbers'

    def get_country_code(self):
        print(self.user.user_country)
        country = self.user.user_country
        if country:
            return country.short_name

        return None

    def set_national_format(self, phone_number, country=None):
        country = self.get_country_code()
        print(country, phone_number)
        if not country:
            return

        self.national_format = get_national_number_format(country, phone_number)
        self.save()

    def set_inter_format(self, phone_number, country=None):
        country = self.get_country_code()
        if not country:
            return

        self.inter_format = get_inter_number_format(country, phone_number)
        self.save()

    def set_primary(self, primary_number):
        self.primary_number = primary_number
        self.save()

    def is_verified(self):
        return  self.verified

    def set_as_primary(self):
        self.primary = True
        self.save()

    def send_confirmation(self, request=None, signup=False):
        confirmation = PhoneNumberConfirmation.create(self)
        confirmation.send(request, signup=signup)
        return confirmation

    def send_password_rest(self, request=None):
        password_rest = PhoneNumberPasswordChange.create(self)
        password_rest.send(request)
        return password_rest

    def confirmation_expired(self):
        pass
       
        


class PhoneNumberConfirmation(models.Model):
    sms_code = models.CharField(max_length=8, null=True, unique=True)
    phone_number   = models.ForeignKey(PhoneNumber, verbose_name=_('phone number'),
                                      on_delete=models.CASCADE)
    sent     = models.DateTimeField(verbose_name=_('sent'), null=True)
    created  = models.DateTimeField(verbose_name=_('created'),
                                   default=timezone.now)

    class Meta:
        db_table = 'phone_number_confirmations'
        verbose_name = _("phone number confirmation")
        verbose_name_plural = _("phone number confirmations")

    def __str__(self):
        return "confirmation for %s" % self.phone_number

    @classmethod
    def create(cls, phone_number):
        sms_code = _get_pin()
        return cls._default_manager.create(
                                    phone_number=phone_number, 
                                    sms_code=sms_code
                                )
   
    def code_expired(self):
        
        if self.created:
            now = timezone.now()
            expiration_date = now - self.created 
            return expiration_date >= datetime.timedelta(hours=1)

        return True
    code_expired.boolean = True

    def confirm(self, request=None):
        if not self.code_expired() and  not self.phone_number.verified:
            self.phone_number.verified = True
            self.phone_number.save()

    def send(self, request=None, signup=False):
        user = self.phone_number.user
        if not user.is_confirmed or not self.phone_number.verified:
            sms_code = self.sms_code
            sms_body = 'Your Account confirmation code is {0}'.format(sms_code)
            phone_number = user.email
            #send_pin(phone_number, sms_body)
            self.sent = timezone.now()
            self.save()






class PhoneNumberPasswordChange(models.Model):
    sms_code = models.CharField(max_length=8, null=True, unique=True)
    phone_number   = models.ForeignKey(PhoneNumber, verbose_name=_('phone number'),
                                      on_delete=models.CASCADE)
    sent     = models.DateTimeField(verbose_name=_('sent'), null=True)
    created  = models.DateTimeField(verbose_name=_('created'),
                                   default=timezone.now)
    password_changed = models.BooleanField(verbose_name=_('password has changed'),
                                           default=False)

    class Meta:
        db_table = 'phone_number_password_change'
        verbose_name = _("phone number password change")
        verbose_name_plural = _("phone number password change")

    def __str__(self):
        return "password change for %s" % self.phone_number

    @classmethod
    def create(cls, phone_number):
        sms_code = _get_pin()
        return cls._default_manager.create(phone_number=phone_number, sms_code=sms_code)
   
    def code_expired(self):
        now = timezone.now()
        expiration_date = now - self.created 
        expired = expiration_date >= datetime.timedelta(hours=1)
        return expired
    code_expired.boolean = True


    def confirm(self, request=None):
        self.password_changed = True
        self.save()

    def send(self, request=None):
        if self.phone_number.verified:
            sms_code = self.sms_code
            sms_body = 'Your Account password change code is {0}'.format(sms_code)
            phone_number = self.phone_number.user
            #send_pin(phone_number, sms_body)
            self.sent = timezone.now()
            self.save()





       

def create_phone_number(sender, instance, created, **kwargs):

    if created and not kwargs.get('raw', False):
        phone_number = PhoneNumber(user=instance)
        phone_number.save()



class Country (models.Model):
    long_name  = models.CharField(max_length=50, null=True)
    short_name = models.CharField(max_length=5, null=True) 
    user          = models.OneToOneField(settings.AUTH_USER_MODEL,
                       on_delete= models.CASCADE, related_name="user_country", blank=True)

    def __str__(self):
        return (self.user.email)
    
    def save(self, *args, **kwargs):
        super().save()

    class Meta:
        db_table = 'user_country'

    def set_long_name(self, country, phone_number):
        if not country:
            country = self.user.country
            country = country.short_name

        self.long_name = get_phone_number_region(country, phone_number)
        self.save()

    def set_short_name(self, short_name):
        self.short_name = short_name
        self.save()

            

       
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_country(sender, instance, created, **kwargs):

    if created and not kwargs.get('raw', False):
        country = Country(user=instance)
        country.save()


