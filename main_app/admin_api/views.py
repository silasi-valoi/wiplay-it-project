from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response

from main_app.models import (AboutCompany)
from main_app.utils import get_model_fields
from main_app.serializers import (AboutSerializer )
from main_app.admin_api.serializers import AdminSerializer
from main_app.views import BaseView, BaseApiView
    
	

class AdminView(BaseView, APIView):
	serializer_class = AdminSerializer
		
	def get(self, *args, **kwargs):
		kwargs['context'] = self.get_serializer_context()
		serializer = self.serializer_class(*args, **kwargs)

		return Response(serializer.data,  status=status.HTTP_200_OK )
  

class AboutView(BaseApiView):
	queryset = AboutCompany .objects.all()
	serializer_class = AboutSerializer
	fields_to_update = get_model_fields('about_model_fields')






