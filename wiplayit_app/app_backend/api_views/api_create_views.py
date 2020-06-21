

from django.shortcuts import get_object_or_404
from rest_framework.generics import CreateAPIView, ListAPIView, GenericAPIView
from rest_framework.permissions import AllowAny
from rest_framework import  status
from rest_framework.response import Response
from app_backend.helpers import get_objects_perms
from app_backend.serializers import (DraftEditorContentsSerializer,
									 FeedBackSerializer,
									 ContactAdminSerializer,
                                     BugReportSerializer)
from app_backend.mixins.views_mixins import CreateMixin
from app_backend.admin_api.views import AboutView 
from app_backend.models import ( Question, Post,BugReport,
								 FeedBack,ContactAdmin,
                                 Answer, AnswerComment, 
                                 AnswerReply, PostComment,
                                 PostReply, DraftEditorMediaContent )

from app_backend.views import (BaseApiView, PostView,
                               PostCommentView, PostReplyView,
                               PostChildReplyView,
	                           QuestionView, AnswerView,
	                           AnswerCommentView, AnswerReplyView,
	                           AnswerChildReplyView)



class CreateAboutView(CreateMixin, AboutView):

	def get_object(self):
		pass    

class CreatePostView(CreateMixin, PostView):

	def get_object(self):
		pass 

class AdminMessageViewMixin():

	def post(self, request, *args, **kwargs):
		serializer = self.serializer_class(data=request.data)
		serializer.is_valid(raise_exception=True)
		message = serializer.save()
		
		#send email notification to admins
		notification = serializer.send_notification_to_admin(request)
		return Response(serializer.data, status=status.HTTP_201_CREATED)


class ContactAdminView(AdminMessageViewMixin, CreateAPIView):
	queryset         = ContactAdmin.objects.all()
	serializer_class = ContactAdminSerializer

class FeedBackView(AdminMessageViewMixin, CreateAPIView):
	queryset         = FeedBack.objects.all()
	serializer_class = FeedBackSerializer


class BugReportView(AdminMessageViewMixin, CreateAPIView):
	queryset         = BugReport.objects.all()
	serializer_class = BugReportSerializer


class CreatePostCommentView(CreateMixin, PostCommentView):
		
	def get_object(self):
		return get_object_or_404(Post, id=self.kwargs['pk']) 


class CreatePostReplyView(CreateMixin,  PostReplyView):
		
	def get_object(self):
		return get_object_or_404(PostComment, id=self.kwargs['pk'])  
   



class CreatePostReplyChildView(CreateMixin, PostChildReplyView):
		
	def get_object(self):
		return get_object_or_404(PostReply, id=self.kwargs['pk'])  
    
		

class CreateQuestionView(CreateMixin , QuestionView):

	def get_object(self):
		pass    
    	

class CreateAnswerView(CreateMixin, AnswerView):
		
	def get_object(self):
		return get_object_or_404(Question, id=self.kwargs['pk'])  
    
	

class CreateAnswerCommentView(CreateMixin, AnswerCommentView):
		
	def get_object(self):
		return get_object_or_404(Answer, id=self.kwargs['pk']) 
    
	

class CreateAnswerReplyView(CreateMixin, AnswerReplyView):
	
	def get_object(self):
		
		return get_object_or_404(AnswerComment, id=self.kwargs['pk'])  
    




class CreateAnswerReplyChildView(CreateMixin , AnswerChildReplyView):
		
	def get_object(self):
		
		return get_object_or_404(AnswerReply, id=self.kwargs['pk'])  
    
			



class CreateDraftEditorContentsView(CreateMixin, BaseApiView):
	queryset = DraftEditorMediaContent.objects.all()
	serializer_class = DraftEditorContentsSerializer
	permissions = get_objects_perms('draft_editor_contents_perms')

	def post(self, request):
		editor_file = request.data.get('draft_editor_file')
		
		data = {
		  'draft_editor_file' : editor_file,
		}

		serializer = self.create(data)

		return serializer
	
	

