from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import  status
from django.shortcuts import get_object_or_404, render
from django.views.decorators.csrf import csrf_exempt

from main_app.utils import get_users_with_permissions
from main_app.models import (Question, Post,
								Answer,Comment,
								Reply, DefaultProfilePicture,
								AboutCompany )

from main_app.views import ( BaseView, BaseApiView, QuestionView, PostDetailView,
                                PostCommentDetailView,PostReplyDetailView,
	                            QuestionDetailView, AnswerCommentDetailView, 
	                            AnswerReplyDetailView )

from auth_app.views import UserView
from main_app.serializers import ( IndexSerializer, AboutSerializer,
									  DefaultProfilePictureSerializer )
from main_app.mixins.views_mixins import RetrieveMixin



@csrf_exempt
def index(request, resource=''):
	return render(request, 'index.html')


class DefaultProfilePictureView(BaseApiView, APIView):
	permission_classes = (AllowAny,)
	serializer_class = DefaultProfilePictureSerializer
	queryset = DefaultProfilePicture.objects.all()

	def get(self, *args, **kwargs):
		serializer = self.serializer_class(*args, **kwargs)
		
		return Response(serializer.data,  status=status.HTTP_200_OK)

class AboutView(BaseApiView, APIView):
	permission_classes = (AllowAny,)
	serializer_class   = AboutSerializer
	queryset           = AboutCompany.objects.all()
		
	def get(self, *args, **kwargs):
		kwargs['context'] = self.get_serializer_context()
		serializer = self.serializer_class(*args, **kwargs)

		return Response(serializer.data,  status=status.HTTP_200_OK )


class IndexView(BaseView, APIView):
	permission_classes = (AllowAny,)
	serializer_class = IndexSerializer
		
	def get(self, *args, **kwargs):
		kwargs['context'] = self.get_serializer_context()
		serializer = self.serializer_class(*args, **kwargs)
		
		return Response(serializer.data,  status=status.HTTP_200_OK )
		
class RetrievePostListView(RetrieveMixin, PostDetailView):
	pass
	

class RetrieveQuestionListView(RetrieveMixin, QuestionView):
		
	def get_action_data(self, request):
		serializer = self.list(request)
		return Response(serializer.data, status=status.HTTP_200_OK)
			
class RetrievePostView(RetrieveMixin, PostDetailView):
	pass
		

class RetrieveQuestionView(RetrieveMixin, QuestionDetailView):
	permission_classes = (AllowAny,)

	def get_action_data(self, request):
		serializer = self.retrive(request)
		return Response(serializer.data, status=status.HTTP_200_OK)


class RetrieveAnswerCommentListView(RetrieveMixin, AnswerCommentDetailView):
		
	def get_queryset(self):
		return Comment.objects.filter(answer=self.kwargs['pk'])
			
		

class RetrieveAnswerReplyListView(RetrieveMixin, AnswerReplyDetailView):
	
	def get_queryset(self):
		return  Reply.objects.filter(comment=self.kwargs['pk'])
		
		
class RetrieveAnswerReplyChildrenListView(RetrieveAnswerReplyListView):
	
	def get_queryset(self):
		return Reply.objects.filter(parent=self.kwargs['pk'])
	



class RetrieveQuestionFollowers(RetrieveMixin, UserView):
	
	
	def get_queryset(self):
		question = get_object_or_404(Question, pk=self.kwargs['pk'])
		followers_perms = self.get_obj_permissions('question_perms', 'followers_perms')
		return get_users_with_permissions(question, followers_perms)
		
	


class RetrieveAnswerUpVoters(RetrieveMixin, UserView):

	def get_queryset(self):
		upvotes_perm =  self.get_obj_permissions('answer_perms', 'upvotes_perms')
		answer = get_object_or_404(Answer, pk=self.kwargs['pk'])
		return get_users_with_permissions(answer, upvotes_perm)
		



		
class RetrieveAnswerCommentUpVoters(RetrieveMixin, UserView):

	def get_queryset(self):
		comment = get_object_or_404(Comment, pk=self.kwargs['pk'])
		upvotes_perm = self.get_obj_permissions('answer_comment_perms', 'upvotes_perms')
		return get_users_with_permissions(comment, upvotes_perm)
		


class RetrieveAnswerReplyUpVoters(RetrieveMixin, UserView):

	def get_queryset(self):
		reply = get_object_or_404(Reply, pk=self.kwargs['pk'])
		upvotes_perm = self.get_obj_permissions('answer_reply_perms', 'upvotes_perms')
		return get_users_with_permissions(reply, upvotes_perm)
		



class RetrievePostCommentListView(RetrieveMixin, PostCommentDetailView):
		
	def get_queryset(self):
		return Comment.objects.filter(post=self.kwargs['pk'])
		
	

class RetrievePostReplyListView(RetrieveMixin, PostReplyDetailView):
	
	def get_queryset(self):
		return  Reply.objects.filter(comment=self.kwargs['pk'])
		
		


class RetrievePostReplyChildrenListView(RetrievePostReplyListView):
	
	def get_queryset(self):
		return Reply.objects.filter(parent=self.kwargs['pk'])
		




class RetrievePostUpVoters(RetrieveMixin, UserView ):

	def get_queryset(self):
		upvotes_perm = self.get_obj_permissions('post_perms', 'upvotes_perms')
		post = get_object_or_404(Post, pk=self.kwargs['pk'])
		return get_users_with_permissions(post, upvotes_perm)
		
		
		
	
class RetrievePostCommentUpVoters(RetrieveMixin, UserView):

	def get_queryset(self):
		comment = get_object_or_404(Comment, pk=self.kwargs['pk'])
		upvotes_perm = self.get_obj_permissions('post_comment_perms', 'upvotes_perms')
		return get_users_with_permissions(comment, upvotes_perm)
		
		



		
class RetrievePostReplyUpVoters(RetrieveMixin, UserView):

	def get_queryset(self):
		reply = get_object_or_404(Reply, pk=self.kwargs['pk'])
		upvotes_perm = self.get_obj_permissions('post_reply_perms', 'upvotes_perms')
		return get_users_with_permissions(reply, upvotes_perm)
		

		

	
	
		
		
		
		
		
