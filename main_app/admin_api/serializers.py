from rest_framework import serializers
from auth_app.models import User
from main_app.models import ( Question, Post, Answer, Comment, Reply,
	                  			 DraftEditorMediaContent, AboutCompany)
 
from main_app.mixins.serializer_mixins import   SerialiizerMixin
from auth_app.serializers import  BaseUserSerializer, UserSerializer

from main_app.serializers import (BaseSerializer, 
	                                 BaseQuestionSerializer,
	                                 AnswerSerializer,
	                                 AnswerCommentSerializer,
	                                 AnswerReplySerializer,
	                                 PostSerializer,
	                                 PostCommentSerializer,
	                                 PostReplySerializer,)


class AdminSerializer(BaseSerializer):
	questions              = serializers.SerializerMethodField()
	answers                = serializers.SerializerMethodField()
	answer_comments        = serializers.SerializerMethodField()
	posts                  = serializers.SerializerMethodField()
	post_comments          = serializers.SerializerMethodField()
	post_comment_replies   = serializers.SerializerMethodField()
	answer_comment_replies = serializers.SerializerMethodField()


	def get_questions(self, obj):
		questions = Question.objects.all()
		return BaseQuestionSerializer(questions, context=self.context, many=True).data

	def get_answers(self, obj):
		answers = Answer.objects.all()
		return AnswerSerializer(answers, context=self.context, many=True).data

	def get_answer_comments(self, obj):
		comments = Comment.objects.all()
		return AnswerCommentSerializer(comments, context=self.context, many=True).data

	def get_answer_comment_replies(self, obj):
		comments = Comment.objects.all()
		return AnswerCommentSerializer(comments, context=self.context, many=True).data


	def get_posts(self, obj):
		posts = Post.objects.all()
		return PostSerializer(posts, context=self.context, many=True).data


	def get_post_comments(self, obj):
		comments = Comment.objects.all()
		return PostCommentSerializer(comments, context=self.context, many=True).data

	def get_post_comment_replies(self, obj):
		replies = Reply.objects.all()
		return PostReplySerializer(replies, context=self.context, many=True).data




	

