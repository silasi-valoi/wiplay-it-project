
from django.urls import path
from app_backend.admin_api.views import AdminView
from app_backend.api_views.api_update_views import UpdateAboutView
from app_backend.api_views.api_create_views import CreateAboutView

app_name = 'admin_apis'

urlpatterns = [
    path("api/admin/", AdminView.as_view(), name='api-admin'),

    path("api/about/change/<int:pk>/",
          UpdateAboutView.as_view({'get':'retrieve','put':'put' }), name='about-change'),

    path("api/about/create/", 
        CreateAboutView.as_view({'get':'get','post':'post' }), name="about_create"),
]

