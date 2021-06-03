from django.conf import settings
from django.core.mail import send_mail, EmailMessage
from django.template.loader import render_to_string
from rest_framework import serializers
from django.utils.translation import ugettext_lazy as _
from auth_backend.models import User
from .models import ( Question, Post, Answer, AnswerComment, AnswerReply,
	                  PostComment, PostReply, DraftEditorMediaContent,
	                  AnswerBookmark,PostBookmark, AboutCompany, DefaultProfilePicture,
	                  BugReport, FeedBack, ContactAdmin)

from .mixins.serializer_mixins import   SerialiizerMixin
from auth_backend.serializers import  BaseUserSerializer, UserSerializer
from .helpers import get_users_with_permissions,  has_perm



class BaseModelSerializer(SerialiizerMixin, serializers.ModelSerializer):
	user_can_edit   = serializers.SerializerMethodField()

class BaseSerializer(SerialiizerMixin, serializers.Serializer):
	pass

	
class DefaultProfilePictureSerializer(serializers.ModelSerializer):
		
	class Meta:
		model  = DefaultProfilePicture 
		fields = '__all__'
	
	
class BaseChildSerializer(BaseModelSerializer):
	upvoted    = serializers.SerializerMethodField()
	author = BaseUserSerializer(read_only=True)
				
	def get_upvoted(self, obj):
		perms = self.get_obj_permissions('upvotes_perms')
		if perms and self.current_user().is_authenticated:
			return has_perm(self.current_user(), perms, obj)

		return False

class BaseReplySerializer(BaseChildSerializer):
	children     = serializers.SerializerMethodField()
	has_children = serializers.SerializerMethodField()
	child_count  = serializers.SerializerMethodField()
	
	def get_children(self, obj):
		children = obj.get_children()
		child_serializer =	self.children_serializer(children)
		return child_serializer
		
	def get_has_children(self, obj):
		return not obj.is_leaf_node() 	
		
	def get_child_count(self, obj):
		if not obj.is_leaf_node():
			return obj.get_children().count()
		return 0 	
	

class AnswerReplySerializer(BaseChildSerializer):
		
	class Meta:
		model = AnswerReply 
		fields = '__all__'

		
class AnswerReplyReadSerializer(BaseReplySerializer):
	
	class Meta:
		model = AnswerReply 
		fields = '__all__'
		
	def children_serializer(self, children_queryset=[]):
		self.update_serializer_obj_perms('answer_reply_perms')
		return AnswerReplyReadSerializer(
				children_queryset, 
				context=self.context,
				many=True).data
		

class AnswerCommentSerializer(BaseChildSerializer):
		

	class Meta:
		model = AnswerComment
		fields = '__all__'


class AnswerCommentReadSerializer(AnswerCommentSerializer):
	replies    = serializers.SerializerMethodField()

	def get_replies(self, obj):
		self.update_serializer_obj_perms('answer_reply_perms')
		return AnswerReplyReadSerializer(
					obj.replies,
					context=self.context,
					many=True).data


class PostReplySerializer(BaseChildSerializer):
	
	class Meta:
		model = PostReply 
		fields = '__all__'



class PostReplyReadSerializer(BaseReplySerializer):
	
	class Meta:
		model = PostReply 
		fields = '__all__'
		
	def children_serializer(self, children_queryset=[]):
		self.update_serializer_obj_perms('post_reply_perms')
		return PostReplyReadSerializer(
					children_queryset,
					context=self.context, 
					many=True).data


class PostCommentSerializer(BaseChildSerializer):

	class Meta:
		model = PostComment 
		fields = '__all__'



class PostCommentReadSerializer(PostCommentSerializer):
	replies    = serializers.SerializerMethodField()

	def get_replies(self, obj):
		self.update_serializer_obj_perms('post_reply_perms')
		return PostReplyReadSerializer(
					obj.replies,
					context=self.context,
					many=True).data

class PostSerializer(BaseChildSerializer):
		
	class Meta:
		model = Post 
		fields = '__all__'
		

class PostReadSerializer(PostSerializer):
	comments    = serializers.SerializerMethodField()


	def get_comments(self, obj):
		self.update_serializer_obj_perms('post_comment_perms')
		return PostCommentReadSerializer(
					obj.comments, 
					context=self.context,
					many=True).data
	

class AnswerSerializer(BaseChildSerializer):
	
	class Meta:
		model = Answer 
		fields = '__all__'
		
class AnswerReadSerializer(AnswerSerializer):
	comments   = serializers.SerializerMethodField()
	question   =  serializers.SerializerMethodField()

	def get_comments(self, obj):
		self.update_serializer_obj_perms('answer_comment_perms')
		return AnswerCommentReadSerializer(
						obj.comments,
						context=self.context,
						many=True).data


	def get_question(self, obj):
		self.update_serializer_obj_perms('question_perms')
		question = obj.question
		question = Question.objects.get(id=question.id)
		
		return QuestionSerializer(question ,context=self.context, many=False).data


class BaseQuestionSerializer(BaseChildSerializer):	
	upvoted = None

	class Meta:
		model = Question 
		fields = '__all__'


class QuestionSerializer(BaseQuestionSerializer):
	
	user_is_following =  serializers.SerializerMethodField()
	user_has_answer   =  serializers.SerializerMethodField()
	answer_count      =  serializers.SerializerMethodField()
	
	def get_user_is_following(self, obj):
		perms = self.get_obj_permissions('followers_perms')
		if self.current_user().is_authenticated:
			return has_perm(self.current_user(), perms, obj)

		return False
		
		
	
	def get_user_has_answer(self, obj):
		if self.current_user().is_authenticated:
			return obj.answers.filter(author=self.current_user()).exists()
		return 	False
		
	def get_answer_count(self, obj):
		return obj.answers.count()
		

class QuestionReadSerializer(QuestionSerializer):
	answers = serializers.SerializerMethodField()

	def get_answers(self, obj):
		self.update_serializer_obj_perms('answer_perms')
		return AnswerReadSerializer(
					obj.answers, 
					context=self.context,
					many=True
					).data
	

class DraftEditorContentsSerializer(BaseModelSerializer):
	
	class Meta:
		model = DraftEditorMediaContent
		fields = '__all__'


class AnswerBookmarkSerializer(BaseModelSerializer):
	bookmark = serializers.SerializerMethodField()

	class Meta:
		model = AnswerBookmark
		fields = '__all__'

	def create(self, validated_data):
		ModelClass = self.Meta.model
		instance, created = ModelClass._default_manager.get_or_create(**validated_data)
				
		return instance

	def get_bookmark(self, obj):
		if not self.current_user().is_authenticated: 
			return []

		answer_bookmarks = Answer.objects.filter(
								answer_bookmarks__author=self.current_user(),
								answer_bookmarks=obj.id

							)
		
		answer_bookmarks_serialiser = AnswerReadSerializer(
											answer_bookmarks, 
											context=self.context,
											many=True).data	
		return answer_bookmarks_serialiser


class PostBookmarkSerializer(BaseModelSerializer):
	post = serializers.SerializerMethodField()

	class Meta:
		model = PostBookmark
		fields = '__all__'

	def create(self, validated_data):
		ModelClass = self.Meta.model
		instance, created = ModelClass._default_manager.get_or_create(**validated_data)
				
		return instance

	
	def get_post(self, obj):
		if not self.current_user().is_authenticated: 
			return []

		post_bookmarks = Post.objects.filter(
								post_bookmarks__author=self.current_user(),
								post_bookmarks=obj.id

							)
		
		post_bookmarks_serialiser = PostReadSerializer(
											post_bookmarks, 
											context=self.context,
											many=True).data	
		return post_bookmarks_serialiser


class IndexSerializer(BaseSerializer):
	questions = serializers.SerializerMethodField()
	answers   = serializers.SerializerMethodField()
	posts     = serializers.SerializerMethodField() 
	users     = serializers.SerializerMethodField()
	bookmarks = serializers.SerializerMethodField()
	

	def get_bookmarks(self, obj):
		if not self.current_user().is_authenticated: 
			return []

		
		answer_bookmarks = Answer.objects.filter(
								answer_bookmarks__author=self.current_user()

							)
		post_bookmarks = Post.objects.filter(
							post_bookmarks__author=self.current_user())
		answer_bookmarks_serialiser = AnswerReadSerializer(
											answer_bookmarks, 
											context=self.context,
											many=True).data	
		post_bookmarks_serialiser = PostReadSerializer(
											post_bookmarks, 
											context=self.context,
											many=True).data	
		return {
			'answers':answer_bookmarks_serialiser,
			'posts':post_bookmarks_serialiser
		}
	
	def get_questions(self, obj):
		questions = Question.objects.all()
		self.update_serializer_obj_perms('question_perms')		       
		return QuestionSerializer(questions, context=self.context, many=True).data
		
		
	def get_answers(self, obj):
		answers = Answer.objects.all()
		self.update_serializer_obj_perms('answer_perms')
		return AnswerReadSerializer(answers, context=self.context, many=True).data
	
	
	def get_posts(self, obj):
		if not self.current_user().is_authenticated: 
			return []

		posts = Post.objects.exclude(author=self.current_user())
		self.update_serializer_obj_perms('post_perms')

		return PostReadSerializer(posts, context=self.context, many=True).data

	def get_users(self, obj):
		self.update_serializer_obj_perms('user_perms')
		user = self.current_user()
		print(user)
		print(self.context)
		users = User.objects.exclude(
						first_name="Anonymous"
					).exclude(
					   id=user.id
					).filter(
						is_confirmed=True
					).filter(
						is_superuser=False
					).filter(
						user
					)

		user_list = UserSerializer(users, context=self.context, many=True).data
		return user_list
		
		
	
	
class AboutSerializer(BaseModelSerializer):
		
	class Meta:
		model  = AboutCompany 
		fields = '__all__'
	
	
class AdminSerializerMixin():
	
	def validate(self, attrs):

		for value in attrs:
			if not attrs[value]:
				msg = _('Please fill in all fields')
				raise serializers.ValidationError(msg)
				break

		return attrs
	

	def get_from_email(self):
		return settings.DEFAULT_FROM_EMAIL

	def render_mail(self, request=None):
		
		subject_template_name = 'admin_notification_mail_subject.txt'
		email_template_name   = 'admin_notification_mail.html'

		full_name   = self.validated_data.get('full_name')
		subject     = self.validated_data.get('subject')
		description = self.validated_data.get('description')
		email       = self.validated_data.get('email')


		subject = render_to_string(subject_template_name, {'subject':subject})
		subject = ''.join(subject.splitlines())

		context = {
			'description':description,
			'full_name':full_name,
			'emai':email,	
		}

		message = render_to_string(email_template_name, context)

		from_email = self.get_from_email()
		to_email = 'silassibaloy@gmail.com'
		msg = EmailMessage(subject, message, from_email, [to_email])
		msg.content_subtype = "html"  # Main content is now text/html

		return msg
		

	def send_notification_to_admin(self, request=None):
		msg = self.render_mail(request)
		m = msg.send()
	
	
class BugReportSerializer(AdminSerializerMixin, BaseModelSerializer):

	class Meta:
		model = BugReport 
		fields = '__all__'
	
class FeedBackSerializer(AdminSerializerMixin, BaseModelSerializer):

	class Meta:
		model = FeedBack 
		fields = '__all__'
	

	
class ContactAdminSerializer(AdminSerializerMixin, BaseModelSerializer):

	class Meta:
		model = ContactAdmin 
		fields = '__all__'
	

