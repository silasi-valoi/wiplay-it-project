
from rest_framework import  status
from rest_framework.response import Response
from guardian.shortcuts import assign_perm, remove_perm
from app_backend.slug_generator import generate_unique_slug
from app_backend.helpers import  get_objects_perms, has_perm
import phonenumbers
from auth_backend.utils import send_pin
	


class BaseMixin(object):

    def get(self, request, pk=None):
    	return Response({}, status=status.HTTP_200_OK)  
    	
    def get_obj_permissions(self, obj_perms=None, perm_to=None):
    	permissions = get_objects_perms(obj_perms)
    	
    	if permissions and perm_to is not None:
    		return permissions.get(perm_to)
   
    	return None



        
    def update_text_field(self, instance=None):
    	data = dict()
    	if hasattr(self, 'fields_to_update'):
    		related_field  = self.fields_to_update.get('related_field', False) 
    		text_field     = self.fields_to_update.get('text_field', False)
     	 
    	if  hasattr(self, 'is_user'):
    		data = self.update_user_fields(instance)
    		
    	else:
    		data[text_field ]  = self.request.data.get(text_field, False)
    		add_post     = self.request.data.get("add_post", False)
    		add_question     = self.request.data.get("add_question", False)

    		if add_question or add_post:

    			if instance is not None:
    				data['slug']   = self.update_slug_field(instance)

    			if add_post:
    				data['add_title'] = self.request.data.get("add_title") 
    	return data


    def update_slug_field(self, instance):
    	
    	field_to_slugify = ''

    	if hasattr(self, 'is_user'):
    		first_name = self.request.data.get('first_name')
    		last_name  = self.request.data.get('last_name')
    		field_to_slugify = '{0} {1}'.format(first_name, last_name)

    	elif self.request.data.get("add_post", False):
    		field_to_slugify = self.request.data['add_title']

    	elif  self.request.data.get("add_question", False):
    		field_to_slugify = self.request.data['add_question']

    	if field_to_slugify != '':
    		return generate_unique_slug(instance.__class__, field_to_slugify)

    	return	
        
    	
     	
    def remove_perm(self, perm, instance, user=None):
    	if user is None:
    		user = self.request.user
    	return remove_perm(perm, user, instance)

    	        
    def assign_perm(self,  perm, instance, user=None):
        if user is None:
            user = self.request.user

        return assign_perm(perm, user, instance )
        
        
class UpdateObjectMixin(BaseMixin):

	def unfollow(self, instance):
		instance.followers = instance.followers - 1
		return instance.save()


	def follow(self, instance):
		instance.followers = instance.followers + 1
		return instance.save()

	def downvote(self, instance):
		instance.upvotes = instance.upvotes - 1
		return instance.save()


	def upvote(self, instance):
		instance.upvotes = instance.upvotes + 1
		return instance.save()


	def modify_current_user_followings_field(self, instance, increm=False, decrem=False):
		if increm:
			instance.followings = instance.followings + 1
			
		elif decrem:
			instance.followings = instance.followings - 1
		return instance.save() 
	

	def update_followers_fields(self, instance, **kwargs):
		data    = dict()
		current_user     = self.request.user
		
		followers_perms = self.permissions.get('followers_perms',None)
		user_is_following = has_perm(current_user, followers_perms, instance)

		if  hasattr(self, 'is_user'):
			profile    = dict()
			followings_perms = self.permissions.get('followings_perms',None)
			

			if user_is_following:
				
				current_user.profile = self.modify_current_user_followings_field(instance.profile, decrem=True)
				self.unfollow(instance.profile)

				self.remove_perm(followers_perms, instance)
				self.remove_perm(followings_perms, current_user, user=instance)
				
			else:
				current_user.profile = self.modify_current_user_followings_field(instance.profile, increm=True)
				self.follow(instance.profile)

				self.assign_perm(followers_perms, instance)
				self.assign_perm(followings_perms, current_user, user=instance)

			
			profile['followers']  = instance.profile.followers
			data['profile'] = profile
			return data

		
		if user_is_following:
			self.unfollow(instance)
			self.remove_perm(followers_perms, instance)
			
		else:
			self.follow(instance)
			self.assign_perm(followers_perms, instance)
			
		
				
		data['followers']  = instance.followers
		return data
		
		
	def update_upvotes_fields(self, instance): 

		upvotes_perm = self.permissions.get('upvotes_perms',None)
		data = dict()
		current_user     = self.request.user
				
		if has_perm(current_user, upvotes_perm, instance):
			instance.upvotes = instance.upvotes - 1
			instance.save()
			self.remove_perm(upvotes_perm, instance )
			
		else:
			instance.upvotes = instance.upvotes + 1
			instance.save()
			self.assign_perm(upvotes_perm, instance )
			
		data['upvotes']  = instance.upvotes
		return data 

	def update_phone_number_field(self, instance):
		print(self.request.data)
		phone_number = self.request.data.get('phone_number')
		country = self.request.data.get('country')
		self.format_phone_number(phone_number, country)
		
	def format_phone_number(self, username, country):
		national_format  = phonenumbers.parse(username, country)
		#print(national_format)

		int_format = phonenumbers.format_number(
									national_format,
									phonenumbers.PhoneNumberFormat.INTERNATIONAL
								)
		#print(int_format)
		national_format_number = phonenumbers.format_number(
									national_format, 
									phonenumbers.PhoneNumberFormat.E164
							)
		print(national_format_number)	

		send_pin(self.request, national_format_number)	
		
	def update_user_fields(self, instance=None):
		profile     = dict()
		data        = dict()
		text_fields  = self.fields_to_update.get('text_fields', False)
		
		user_fields = text_fields.get('user')
		profile_fields = text_fields.get('profile')

		
		for field in user_fields:
			request_field = self.request.data.get(field, False)
			if request_field:
				data[field] = request_field

				if request_field == 'first_name':
					data['slug']       = self.update_slug_field(instance)

		for field in profile_fields:
			request_field = self.request.data.get(field, False)
					
			if request_field:
				#print(request_field)
				profile[field]  = request_field
						

		data['profile']  = profile
		return data
		
		
	def put(self, request, *args, **kwargs):
	 	instance = self.get_object()
	 		 		 	
	 	if  request.data.get("followers", False):
	 		kwargs['data'] = self.update_followers_fields(instance)
	 		
	 	elif  request.data.get("upvotes", False):
	 		kwargs['data'] = self.update_upvotes_fields(instance)
	 		 		
	 	else:
	 		kwargs['data'] = self.update_text_field(instance)

	 	return self.update( request, *args, **kwargs)
	 	
	 	
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
			print(serializer.errors)
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  
			
		if getattr(instance, '_prefetched_objects_cache', None):
			# If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
			instance._prefetched_objects_cache = {}

            
		return Response(serializer.data, status=status.HTTP_200_OK)    
        
    	
class CreateMixin(BaseMixin):
	
	def post(self, request, *args, **kwargs):
		instance       = self.get_object()
		related_field  = self.fields_to_update.get('related_field', False)
		data           = self.update_text_field(instance)

		if related_field and instance:
			data[related_field] = instance.id
		
		serializer = self.create(data)
		return serializer
	
		
	def create(self, data):
		created_by = self.request.user;	

		if  hasattr(self, 'permissions'):
			edit_perms = self.permissions.get('edit_perms',None)

		print(data)
		print(self.request.data)

		serializer = self.get_serializer(data=data)
		if not serializer.is_valid():
			print(serializer.errors)
			
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

		if data and data.get('about_text', None) is None:
			instance = serializer.save(created_by=created_by)
		else:
			instance = serializer.save()


		print(serializer.data)

		is_superuser = created_by.is_superuser
		if not is_superuser and edit_perms is not None:
			for perm in edit_perms:
				self.assign_perm(perm, instance)

		return Response(serializer.data, status=status.HTTP_201_CREATED)
		
		
	
         
        
	
	        
            
class RetrieveMixin(BaseMixin):
	pass
	
	
	




