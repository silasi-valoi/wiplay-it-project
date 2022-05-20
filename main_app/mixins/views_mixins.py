from rest_framework.permissions import AllowAny
from rest_framework import  status
from rest_framework.response import Response
from guardian.shortcuts import assign_perm
from main_app.utils import generate_unique_slug
from main_app.utils import  get_objects_perms
	

class BaseMixin(object):

	def get(self, request, pk=None):
		return Response({}, status=status.HTTP_200_OK)  

	def update_text_field(self, instance=None, updating=False):
		data = dict()
		text_field:str = None
		
		if hasattr(self, 'fields_to_update'):
			text_field = self.fields_to_update.get('text_field', None)

		if  hasattr(self, 'is_user'):
			data = self.update_user_fields(instance)

		elif text_field:
			field = self.request.data.get(text_field, None)
			data[text_field ]  = field

			if text_field == 'question' and instance is not None:
				data['slug'] = self.update_slug_field(instance, field)

			if text_field == 'post':
				
				title = self.request.data.get("title")
				data['title'] =  title

				if instance is not None:
					data['slug'] = self.update_slug_field(instance, title)

			data['updated'] = updating

		return data 

	def update_slug_field(self, instance, slug_field):

		if slug_field:
			return generate_unique_slug(instance.__class__, slug_field)

		return None
        
        
class UpdateObjectMixin(BaseMixin):

	def update_followers_fields(self, instance, **kwargs):
		data   = dict()
		request = self.request
		followers_perms = self.permissions.get('followers_perms', None)
			
		profile    = dict()

		if request.user.has_perm(followers_perms ,instance):
			instance.unfollow(request.user, self.permissions)
			
		else:
			instance.follow(request.user, self.permissions)

		if hasattr(self, 'is_user'):
			profile['followers']  = instance.profile.followers
			data['profile'] = profile
			return data
			
		data['followers']  = instance.followers
		return data
		
		
	def update_upvotes_fields(self, instance): 

		upvotes_perm = self.permissions.get('upvotes_perms',None)
		data = dict()
		user = self.request.user

		if user.has_perm(upvotes_perm, instance):
			print('DownVoting')
			instance.downvote(user, self.permissions)

		else:
			print('Upvoting')
			instance.upvote(user, self.permissions)
		
		data['upvotes']  = instance.upvotes
		return data

	def get_user_slug(self):
		first_name = self.request.data.get('first_name')
		last_name  = self.request.data.get('last_name')

		return '{0} {1}'.format(first_name, last_name)		
		
	def update_user_fields(self, instance=None):
		profile = dict()
		data = dict()
		text_fields  = self.fields_to_update.get('text_fields', False)
		
		user_fields = text_fields.get('user')
		profile_fields = text_fields.get('profile')

		
		for field in user_fields:
			request_field = self.request.data.get(field, False)
			if request_field:
				data[field] = request_field

				if request_field == 'first_name':
					slug_field = self.get_user_slug()					
					data['slug'] = self.update_slug_field(instance, slug_field)

		for field in profile_fields:
			request_field = self.request.data.get(field, False)
					
			if request_field:
				profile[field]  = request_field
						

		data['profile']  = profile
		return data
		
		
	def put(self, request, *args, **kwargs):
		instance = self.get_object()
		updating = True

		if  request.data.get("followers", False):
			kwargs['data'] = self.update_followers_fields(instance)

		elif  request.data.get("upvotes", False):
			kwargs['data'] = self.update_upvotes_fields(instance)

		else:
			kwargs['data'] = self.update_text_field(instance, updating)

		return self.update(request, *args, **kwargs)
	 	
	 	
	def update(self, request, *args, **kwargs):
		data = kwargs.pop("data", None)
		instance = self.get_object()
		
		serializer = self.get_serializer(
            					instance, 
            					data,
            					context={'request': request},
            					partial  = True)

		if serializer.is_valid():
			self.perform_update(serializer)

		else:
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  
			
		if getattr(instance, '_prefetched_objects_cache', None):
			# If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
			instance._prefetched_objects_cache = {}
  
		return Response(serializer.data, status=status.HTTP_200_OK)    
        
    	
class CreateMixin(BaseMixin):
	
	def post(self, request, *args, **kwargs):
		data = request.data

		if  hasattr(self, 'fields_to_update'):
			instance = self.get_object()
			data = self.update_text_field(instance)
			related_field  = self.fields_to_update.get('related_field', None)

			if related_field:
				data[related_field] = instance.id
		
		serializer = self.create(data)
		return serializer
	
		
	def create(self, data):
		author = self.request.user;	
		print(data)

		serializer = self.get_serializer(data=data)

		if not serializer.is_valid():
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

		if data.get('about_text', None) is None:
			instance = serializer.save(author=author)
			print(instance)
			
		else:
			instance = serializer.save()

		if  hasattr(self, 'permissions'):
			edit_perms = self.permissions.get('edit_perms',None)
			is_superuser = author.is_superuser

			if not is_superuser and edit_perms is not None:
				for perm in edit_perms:
					assign_perm(perm, author, instance)
										
		return Response(serializer.data, status=status.HTTP_201_CREATED)
		          
class RetrieveMixin(BaseMixin):
	permission_classes = (AllowAny,)
	
	def get_obj_permissions(self, obj_perms=None, perm_to=None):
		permissions = get_objects_perms(obj_perms)

		if permissions and perm_to is not None:
			return permissions.get(perm_to)

		return None

class DestroyMixin(BaseMixin):

	def destroy(self, request, *args, **kwargs):
		instance = self.get_object()
		self.perform_destroy(instance)

		serializer = self.get_serializer(instance)
		return Response(serializer.data)


	def perform_destroy(self, instance):
		instance.deleted = True
		instance.save()

	
class DestroyModelMixin(DestroyMixin):
	
	def perform_destroy(self, instance):
		instance.delete()
		
		
	
	
	




