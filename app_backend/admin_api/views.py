from rest_framework.views import APIView
from rest_framework import viewsets, status
from rest_framework.response import Response
   
from app_backend.helpers import get_objects_perms, get_model_fields
from app_backend.models import (AboutCompany)

from app_backend.serializers import (AboutSerializer )
from app_backend.admin_api.serializers import AdminSerializer
from app_backend.views import BaseView, BaseApiView
    
	

class AdminView(BaseView, APIView):
	serializer_class = AdminSerializer
		
	def get(self, *args, **kwargs):
		kwargs['context'] = self.get_serializer_context()
		serializer = self.serializer_class(*args, **kwargs)

		return Response(serializer.data,  status=status.HTTP_200_OK )
  

class AboutView(BaseApiView):
	queryset         = AboutCompany .objects.all()
	serializer_class = AboutSerializer
	fields_to_update = get_model_fields('about_model_fields')






