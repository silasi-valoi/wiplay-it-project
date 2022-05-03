import requests
import tempfile
from django.core import files
from django.conf import settings
from allauth.utils import build_absolute_uri
from allauth.account.adapter import DefaultAccountAdapter
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.account.adapter import get_adapter as get_account_adapter
from allauth.account.models import EmailAddress



class CustomAccountAdapter(DefaultAccountAdapter):

    def get_email_confirmation_url(self, request, emailconfirmation):
                
        path = "/registration/account/confirm/" + emailconfirmation.key + "/"
        
        if settings.DEBUG:
            uri = request.build_absolute_uri(path)
        else:
            uri = build_absolute_uri(request, path) 
        return uri

    def send_confirmation_sms(self, request, phoneNumberConfirmation, signup):
        pass





class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    def pre_social_login(self, request, sociallogin):
       
        # social account already exists, so this is just a login
        if sociallogin.is_existing:
            return

        # some social logins don't have an email address
        if not sociallogin.email_addresses:
            return

        # find the first verified email that we get from this sociallogin
        verified_email = None
        for email in sociallogin.email_addresses:
            if email.verified:
                verified_email = email
                break

        # no verified emails found, nothing more to do
        if not verified_email:
            return

        
        # check if given email address already exists as a verified email on
        # an existing user's account
        try:
            existing_email = EmailAddress.objects.get(email__iexact=email.email, verified=True)
        except EmailAddress.DoesNotExist:
            return

        # if it does, connect this new social login to the existing user
        sociallogin.connect(request, existing_email.user)


    def save_user(self, request, sociallogin, form=None):
        """
        Saves a newly signed up social login. In case of auto-signup,
        the signup form is not available.
        """
        user = sociallogin.user
        user.is_confirmed = True
        user.set_unusable_password()
        user.save()

        self.save_profile_picture(user, sociallogin)
       
        if form:
            get_account_adapter().save_user(request, user, form)
        else:
            get_account_adapter().populate_username(request, user)
        sociallogin.save(request)
        return user
    
    def save_profile_picture(self, user, sociallogin):
        if sociallogin == None:
            return
            
        avatar_url = sociallogin.account.get_avatar_url()
        avatar = download_file_from_url(avatar_url)
        profile = user.profile 
        profile.profile_picture = avatar
        profile.save()        




def download_file_from_url(url):
    # Stream the image from the url
    try:
        request = requests.get(url, stream=True)
    except requests.exceptions.RequestException as e:
        return None

   
    if request.status_code != requests.codes.ok:
        return None

    img_temp = tempfile.NamedTemporaryFile(delete=True)
    img_temp.write(request.content)
    img_temp.flush()

    file_name = 'social-login-picture.png'
    return files.File(img_temp, name=file_name)

