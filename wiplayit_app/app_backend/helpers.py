from guardian.shortcuts import get_users_with_perms
from guardian.core import ObjectPermissionChecker

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
                    
        'answer_comment_perms' : {
		    'edit_perms'       : ['change_answercomment', 'delete_answercomment' ],
		    'upvotes_perms'    : "change_answer_comment_upvotes"
		},
		            
		'answer_reply_perms' : {
		    'edit_perms'     : ['change_answerreply', 'delete_answerreply' ],
		    'upvotes_perms'  : 'change_answer_reply_upvotes'
		},
		
		'post_comment_perms': {
		    'edit_perms'    : ['change_postcomment', 'delete_postcomment'],
		 	'upvotes_perms' : "change_post_comment_upvotes"
		},
		           
		'post_reply_perms' : {
		    'edit_perms': ['change_postreply' ,'delete_postreply'],
		    'upvotes_perms':"change_post_reply_upvotes"
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
	          'text_field'      : 'add_question',
	          'followers_field' : 'followers',
		      'slug_field'      : 'add_question',
		},
		
		'answer_model_fields' : {
		      'text_field':'add_answer', 'upvotes_field' :'upvotes',
	          'related_field':'question'
    	},
    	
    	'answer_comment_fields' : {
	    	  'text_field':'comment', 'upvotes_field' :'upvotes',
		       'related_field':'answer'
	    },
	    
    	'answer_reply_fields'   : {
	         'text_field':'reply', 'upvotes_field' :'upvotes',
		     'related_field':'comment'
	    },
	   
	   'answer_reply_child_fields' : {
	  	     'text_field':'reply', 'upvotes_field' :'upvotes',
		     'related_field':'parent'
  	    },
  	    
        'post_fields' :  {
		    'text_field' : 'add_post', 'upvotes_field' : 'upvotes',
	    },
	   
        'post_comment_fields' : {
	     	'text_field':'comment', 'upvotes_field' :'upvotes',
		    'related_field':'post'
	    },
      
        'post_reply_fields' : {
	     	'text_field':'reply', 'upvotes_field' :'upvotes',
		    'related_field':'comment'
	    },
	  
	    'post_reply_child_fields' : {
	     	'text_field':'reply', 'upvotes_field' :'upvotes',
		    'related_field':'parent'
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

	if perm and user and checker:
		return checker.has_perm(perm, instance)

	return False


