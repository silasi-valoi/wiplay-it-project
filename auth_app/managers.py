from django.contrib.auth.base_user import BaseUserManager
from django.db import models



class UserManager(BaseUserManager):
    use_in_migrations = True
    
    def _create_user(self, email, password, **extra_fields):
        """
        Creates and saves a User with the given email and password.
        """
        
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_confirmed', True)
        extra_fields.setdefault('first_name', 'Site')
        extra_fields.setdefault('last_name', 'Admin')

        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)
        




class PhoneNumberManager(models.Manager):
    
    def add_phone_number(self, request, user, data,
                  confirm=False, signup=False):
        number = data.get('phone_number', None)

        phone_number, created = self.get_or_create(
                                        user=user, 
                                        phone_number__iexact=number,
                                        defaults=data
                                    )

        if signup:
            phone_number.set_as_primary()

        print(phone_number)

        phone_number.set_national_format(number)
        phone_number.set_inter_format(number)

        if created and confirm:
            phone_number.send_confirmation(request, signup=signup)

        return phone_number

        
