
from rest_framework import viewsets

#from rest_framework.permissions import IsAuthenticated
#from rest_framework_guardian import filters
#from .permissions import CustomObjectPermissions

from app_backend.helpers import get_objects_perms, get_model_fields
from auth_backend.models import User
from .models import (Question,
					 Post,
					 Answer,
					 AnswerComment,
					 AnswerReply,
	                 PostComment,
	                 PostReply,
	                 DraftEditorMediaContent )

from app_backend.serializers import ( UserSerializer,
									  QuestionSerializer,
									  QuestionReadSerializer,
	                                  AnswerReadSerializer,
	                                  AnswerSerializer,
	                                  AnswerCommentSerializer,
	                                  AnswerCommentReadSerializer,
	                                  AnswerReplySerializer,
	                                  AnswerReplyReadSerializer )

from app_backend.serializers import (PostSerializer,
									 PostReadSerializer,
									 PostCommentSerializer,
	                                 PostCommentReadSerializer,
	                                 PostReplySerializer,
	                                 PostReplyReadSerializer )


class BaseView():
		
    def get_serializer_context(self):
        context = {
            'request': self.request,
            'format': self.format_kwarg,
            'view': self
        }	     
        
        if  hasattr(self, 'permissions'):
           	context['permissions'] = self.permissions
        	
        return context  
	       
		       
		       

class BaseApiView(BaseView, viewsets.ModelViewSet):
	pass
        

class QuestionView(BaseApiView):
	queryset         = Question.objects.all()
	serializer_class = QuestionSerializer
	permissions      = get_objects_perms('question_perms')
	fields_to_update = get_model_fields('question_model_fields') 
	
class QuestionDetailView(QuestionView):
	serializer_class = QuestionReadSerializer

	
class AnswerView(BaseApiView):
	queryset = Answer.objects.all()
	serializer_class = AnswerSerializer
	permissions     = get_objects_perms('answer_perms')
	fields_to_update = get_model_fields('answer_model_fields') 	
		
class AnswerDetailView(AnswerView):
	serializer_class = AnswerReadSerializer		


class AnswerCommentView(BaseApiView):
	queryset = AnswerComment.objects.all()
	serializer_class = AnswerCommentSerializer
	permissions      = get_objects_perms('answer_comment_perms')
		       
	fields_to_update = get_model_fields('answer_comment_fields') 
	
		
class AnswerCommentDetailView(AnswerCommentView):
	serializer_class = AnswerCommentReadSerializer		

	
		

class AnswerReplyView(BaseApiView):
	queryset         = AnswerReply.objects.all()
	serializer_class = AnswerReplySerializer
	permissions      = get_objects_perms('answer_reply_perms')
	fields_to_update = get_model_fields('answer_reply_fields') 	

class AnswerChildReplyView(AnswerReplyView):
	fields_to_update = get_model_fields('answer_reply_child_fields') 	
	
		
class AnswerReplyDetailView(AnswerReplyView):
	serializer_class = AnswerReplyReadSerializer	


class PostView(BaseApiView):
	queryset = Post.objects.all()
	serializer_class = PostSerializer
	permissions     = get_objects_perms('post_perms')
	fields_to_update = get_model_fields('post_fields') 
		       
		       
class PostDetailView(PostView):
	serializer_class =  PostReadSerializer
	
	
	

class PostCommentView(BaseApiView):
	queryset         = PostComment.objects.all()
	serializer_class = PostCommentSerializer
	permissions      = get_objects_perms('post_comment_perms')
	fields_to_update = get_model_fields('post_comment_fields') 

		       
class PostCommentDetailView(PostCommentView):
	serializer_class = PostCommentReadSerializer
			

class PostReplyView(BaseApiView):
	queryset = PostReply.objects.all()
	serializer_class = PostReplySerializer
	permissions     = get_objects_perms('post_reply_perms')
	fields_to_update = get_model_fields('post_reply_fields') 

class PostChildReplyView(PostReplyView):
	fields_to_update = get_model_fields('post_reply_child_fields') 
	
	
		       
class PostReplyDetailView(PostReplyView):
	serializer_class = PostReplyReadSerializer
	
	
	
	

	
			
			
			
			
