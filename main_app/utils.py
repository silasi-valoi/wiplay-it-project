import itertools
from django.utils.text import slugify

from django.http import Http404
from rest_framework.exceptions import NotAuthenticated, AuthenticationFailed
from guardian.shortcuts import get_users_with_perms
from guardian.core import ObjectPermissionChecker
from rest_framework.views import exception_handler


def generate_unique_slug(model_class, slug_field):
        max_length = model_class._meta.get_field('slug').max_length
        slug = original = slugify(slug_field)[: max_length]

        for i in itertools.count(1):
            if not model_class.objects.filter(slug=slug).exists():
                break

            #Create the unique slug
            slug = '{0}-{1}' .format(original[:max_length - len(str(i)) -1], i)
            
        return slug


def custom_exception_handler(exc, context):
    # Call REST framework's default exception handler first,
    # to get the standard error response.
	
	response = exception_handler(exc, context)

	view = context['view']
	object_name = 'data'
	if hasattr(view, 'get_gueryset'):
		queryset = view.get_queryset()
		object_name = queryset.model._meta.object_name

	if response is not None:
		if isinstance(exc, NotAuthenticated):
			msg = "Looks like you're not logged in."
			response_data = {
    			'detail': msg
    		}
			response.data = response_data

		if isinstance(exc, AuthenticationFailed):
			pass

		if isinstance(exc, Http404):
	
			msg = """The {0} you're trying to access does not
				 	 exist or it has been deleted.
				  """.format(object_name)

			response_data = {
    			'detail': msg
    		}

			response.data = response_data
			print(response.data)

		print(response.data)
		print(exc)

		if isinstance(response.data, dict):
			# Now add the HTTP status code to the response.
			response.data['status_code'] = response.status_code

	return response

   
def get_users_with_permissions(obj,  permission_name=None):
		users = []
				
		if permission_name:
			perms = get_users_with_perms(obj , attach_perms=True)
						
			for user, permission in perms.items():
				if permission_name in permission:
					users.append(user)
			return users
		return users
	
		
def get_objects_perms(perms_for=None):
	
	perms = {
       	'user_perms': {
        	'edit_perms'       : ['change_user','delete_delete'], 
	        'followers_perms'  : "change_user_followers",
        	'followings_perms' : "change_user_followings",
	    },
		    
    	'question_perms'      : {
	        'edit_perms'      : ['change_question','delete_question'], 
		 	'followers_perms' : "change_question_followers"
		},
		   
		'post_perms'        : {
		    'edit_perms'    : ['change_post', 'delete_post' ],
		    'upvotes_perms' : "change_post_upvotes"
		},
		            
		'answer_perms'      :  {
	       	'edit_perms'    : ['change_answer','delete_answer'],
 		    'upvotes_perms' : "change_answer_upvotes"
        },
                    
        'comment_perms' : {
		    'edit_perms'       : ['change_comment', 'delete_comment' ],
		    'upvotes_perms'    : "change_comment_upvotes"
		},
		            
		'reply_perms' : {
		    'edit_perms'     : ['change_reply', 'delete_reply' ],
		    'upvotes_perms'  : 'changer_reply_upvotes'
		},
		
		'draft_editor_contents_perms' : {
		    'edit_perms': [ 'edit_draft_editor_files',
		    				'view_draft_editor_files',
		    				'delete_draft_editor_files' ],
		}
 
    }
		         
	perms.setdefault('permssions', {})
	return perms.get(perms_for)   
	
	
def get_model_fields(for_model=None):
	
	fields = {
		'user_model_fields' : {

 	        'text_fields'      : {
		            'user'    : ['first_name', 'last_name',],
		            'profile' : ['profile_picture', 
		            			'favorite_quote',
		            			 'live', 
		            			 'country',
		            			 'phone_number',
		            			 'credential']
            },

            'followers_field' : 'followers',
		       
		},
		      
		'question_model_fields' : {
	        'text_field'      : 'question',
	        'followers_field' : 'followers',
		    'slug_field'      : 'question',
		},
		
		'answer_model_fields' : {
		    'text_field':'answer', 'upvotes_field' :'upvotes',
	        'related_field':'question'
    	},
    	
    	'answer_comment_fields' : {
	    	'text_field':'comment', 'upvotes_field' :'upvotes',
		    'related_field':'answer'
	    },
	    
    	'reply_fields'   : {
	        'text_field':'reply', 'upvotes_field' :'upvotes',
		    'related_field':'comment'
	    },
	   
	   'reply_child_fields' : {
	  	    'text_field':'reply', 'upvotes_field' :'upvotes',
		    'related_field':'parent'
  	    },
  	    
        'post_fields' :  {
		    'text_field' : 'post', 'upvotes_field' : 'upvotes',
	    },
	   
        'post_comment_fields' : {
	     	'text_field':'comment', 'upvotes_field' :'upvotes',
		    'related_field':'post'
	    },
      
        

	    'about_model_fields' : {
	     	'text_field' :'about_text',
		},

		'answer_bookmarks_model_fields' : {
		   'related_field':'answer'
    	},
		
	}
	
	fields.setdefault('fields', {})
	
	return fields.get(for_model)
	
def permission_checker(user=None):

	if user is not None:
		return ObjectPermissionChecker(user)
	return None

def has_perm(user, perm, instance):
	checker = permission_checker(user)

	if perm and checker:
		return checker.has_perm(perm, instance)

	return False
