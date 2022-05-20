from django.conf.urls import url
from django.urls import path
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token


from .views import ( 
                FacebookLogin, SendAccountConfirmationEmailView, SendAccountConfirmationSmsView, TwitterLogin, 
                GoogleLogin ,  CustomRegisterView,
                CustomLoginView, VerifyEmailView, 
                PasswordChangeConfirmationView, 
                VerifyPhoneNumberView,RegisterPhoneNumberView,
                UpdatePhoneNumberView, CustomPasswordResetView
            )

from .views import ( 
                RetrieveUserListView, RetrieveUserProfileView,
                AddEmailView, AddPhoneNumberView,
                ConfirmEmailView,ConfirmPhoneNumberView,
                RemoveEmailView, RemovePhoneNumberView,
                retrieve_current_user, RetrieveUserFollowers,
                RetrieveUserFollowings, UpdateUserProfileView 
            ) 

app_name = 'rest_auth_apis'


urlpatterns = [
    path('api-token-refresh/', refresh_jwt_token),
    path('api-token-auth/', obtain_jwt_token),
    path('rest-auth/facebook/', FacebookLogin.as_view(), name='fb_login'),
    path('rest-auth/twitter/', TwitterLogin.as_view(), name='twitter_login'),
    path('rest-auth/google/', GoogleLogin.as_view(), name='google_login'),
    path('rest-auth/email/registration/', CustomRegisterView.as_view()),
    path('rest-auth/phone/number/registration/', RegisterPhoneNumberView.as_view()),
    path('rest-auth/login/', CustomLoginView.as_view()),
    path('rest-auth/password/reset/', CustomPasswordResetView.as_view()),
    path('rest-auth/add/phone-number/', AddPhoneNumberView.as_view()),
    path('rest-auth/add/email/', AddEmailView.as_view()),
    path('rest-auth/confirm/phone-number/', ConfirmPhoneNumberView.as_view({'post' : 'post'})),
    path('rest-auth/confirm/email/', ConfirmEmailView.as_view({'post' : 'post'})),
    
    path('rest-auth/remove/phone-number/', RemovePhoneNumberView.as_view({'post': 'destroy'})),
    path('rest-auth/remove/email/', RemoveEmailView.as_view({'post': 'destroy'})),


    url(r'^rest-auth/account-confirm-email/(?P<key>[-:\w]+)/$',
        VerifyEmailView.as_view(), name='account_confirm_email'),

    path('rest-auth/account-confirm-phone-number/',
        VerifyPhoneNumberView.as_view(), name='account_confirm_phone_number'),

    path('rest-auth/password-change-confirm-sms-code/',
        PasswordChangeConfirmationView.as_view(), name='password_change_confirm_code'),

    path('rest-auth/confirmation/email/send/',
         SendAccountConfirmationEmailView.as_view(), name='account_confirm_email_send'),

    path('rest-auth/confirmation/sms/send/',
          SendAccountConfirmationSmsView.as_view(), name='account_confirm_sms_send'),

    path("api/user/<int:pk>/followers/", 
        RetrieveUserFollowers.as_view({'get': 'list'})),

    path("api/user/<int:pk>/followings/",
         RetrieveUserFollowings.as_view({'get': 'list'})),  

    path("api/current/user/", retrieve_current_user, name="api-current-user"),

    path('api/profile/<int:pk>/',
         RetrieveUserProfileView.as_view({'get':'retrieve'}), name='profile'),

    path('api/user/list/',
         RetrieveUserListView.as_view({'get': 'list'}), name="get-user-list"),  

    path('api/profile/<int:pk>/edit/',
         UpdateUserProfileView.as_view({'get':'retrieve','put':'put' }),
         name='update-user-profile'), 

    path('api/profile/number/<int:pk>/change/',
         UpdatePhoneNumberView.as_view({'get':'retrieve','put':'put' }),
         name='update-user-profile'), 

]
