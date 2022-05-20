from django.conf import settings
from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from rest_framework import serializers
from django.utils.translation import ugettext_lazy as _
from auth_app.models import User
from .models import ( Bookmark, Question, Post, Answer, Comment,Reply,
	                  DraftEditorMediaContent, AnswerBookmark,
	                  PostBookmark, AboutCompany, DefaultProfilePicture,
	                  BugReport, FeedBack, ContactAdmin)

from .mixins.serializer_mixins import   SerialiizerMixin
from auth_app.serializers import  BaseUserSerializer, UserSerializer
from .utils import has_perm



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
		if hasattr(self, 'update_perms'):
			self.update_perms()

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
		#print('children', children)
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
		model = Reply 
		fields = '__all__'

	def update_perms(self):
		self.update_serializer_obj_perms('reply_perms')

		
class AnswerReplyReadSerializer(BaseReplySerializer):

	class Meta:
		model = Reply 
		fields = '__all__'
	
			
	def children_serializer(self, children_queryset=[]):
		self.update_serializer_obj_perms('reply_perms')
		return AnswerReplyReadSerializer(
				children_queryset, 
				context=self.context,
				many=True).data
		

class AnswerCommentSerializer(BaseChildSerializer):
		

	class Meta:
		model = Comment
		fields = '__all__'

	def update_perms(self):
		self.update_serializer_obj_perms('comment_perms')


class AnswerCommentReadSerializer(AnswerCommentSerializer):
	replies = serializers.SerializerMethodField()
	replies_count = serializers.SerializerMethodField()   

	def get_replies_count(self, obj):
		return obj.replies.count()

	def get_replies(self, obj):
		self.update_serializer_obj_perms('reply_perms')
		replies = obj.replies.all()[:1]

		return AnswerReplyReadSerializer(
					replies,
					context=self.context,
					many=True).data


class PostReplySerializer(BaseChildSerializer):
	
	class Meta:
		model = Reply 
		fields = '__all__'

	def update_perms(self):
		self.update_serializer_obj_perms('reply_perms')



class PostReplyReadSerializer(BaseReplySerializer):
	
	class Meta:
		model = Reply 
		fields = '__all__'
		
	def children_serializer(self, children_queryset=[]):
		self.update_serializer_obj_perms('reply_perms')
		return PostReplyReadSerializer(
					children_queryset,
					context=self.context, 
					many=True).data


class PostCommentSerializer(BaseChildSerializer):

	class Meta:
		model = Comment 
		fields = '__all__'

	def update_perms(self):
		self.update_serializer_obj_perms('comment_perms')



class PostCommentReadSerializer(PostCommentSerializer):
	replies    = serializers.SerializerMethodField()
	replies_count = serializers.SerializerMethodField()

	def get_replies_count(self, obj):
		return obj.replies.count() 

	def get_replies(self, obj):
		self.update_serializer_obj_perms('reply_perms')
		replies =  obj.replies.all()[:1]

		return PostReplyReadSerializer(
					replies,
					context=self.context,
					many=True).data

class PostSerializer(BaseChildSerializer):
		
	class Meta:
		model = Post 
		fields = '__all__'

	def update_perms(self):
		self.update_serializer_obj_perms('post_perms')
				

class PostReadSerializer(PostSerializer):
	comments    = serializers.SerializerMethodField()
	comments_count = serializers.SerializerMethodField()

	def get_comments_count(self, obj):
		return obj.comments.count() 

	def get_comments(self, obj):
		self.update_serializer_obj_perms('comment_perms')
		comments =  obj.comments.all()[:1]

		return PostCommentReadSerializer(
					comments, 
					context=self.context,
					many=True).data
	

class AnswerSerializer(BaseChildSerializer):
	
	class Meta:
		model = Answer 
		fields = '__all__'

	def update_perms(self):
		self.update_serializer_obj_perms('answer_perms')
		
		
class AnswerReadSerializer(AnswerSerializer):
	comments   = serializers.SerializerMethodField()
	comments_count = serializers.SerializerMethodField()
	question   =  serializers.SerializerMethodField()

	def get_comments_count(self, obj):
		return obj.comments.count() 

	def get_comments(self, obj):
		self.update_serializer_obj_perms('comment_perms')
		comments =  obj.comments.all()[:1]
		
		return AnswerCommentReadSerializer(
						comments,
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
		self.update_serializer_obj_perms('question_perms')
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

class AnswerBookSerialise(serializers.Serializer):
	bookmarks = serializers.SerializerMethodField()

	pass

class AnswerBookmarkSerializer(BaseModelSerializer):
	bookmarks = serializers.SerializerMethodField()

	class Meta:
		model = AnswerBookmark
		fields = '__all__'

	def create(self, validated_data):
		print(validated_data)
		ModelClass = self.Meta.model
		instance, created = ModelClass._default_manager.get_or_create(**validated_data)
		print(created, instance)				
		return instance

	def get_bookmarks(self, obj):
		if not self.current_user().is_authenticated: 
			return []
				
		answers = Answer.objects.filter(
						answers__author=self.current_user(),
					)
		print(answers)
			
		serializer = AnswerReadSerializer(
					    answers, 
						context=self.context,
						many=True
					)
		return serializer.data


class PostBookmarkSerializer(BaseModelSerializer):
	bookmarks = serializers.SerializerMethodField()

	class Meta:
		model = PostBookmark
		fields = '__all__'

	def create(self, validated_data):
		ModelClass = self.Meta.model
		instance, created = ModelClass._default_manager.get_or_create(**validated_data)
				
		return instance

	
	def get_bookmarks(self, obj):
		if not self.current_user().is_authenticated: 
			return []

		post_bookmarks = Post.objects.filter(
								posts__author=self.current_user(),
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

			return {
				'answers':[],
				'posts':[]
			}
		
		answer_bookmarks = Answer.objects.filter(
								answers__author=self.current_user()

							)
				
		post_bookmarks = Post.objects.filter(
								posts__author=self.current_user()
							)
		print(answer_bookmarks)
		print(post_bookmarks)
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
		if self.current_user().is_authenticated:
			questions = Question.objects.exclude(author=self.current_user())[:3]
			
		else:
			questions = Question.objects.all()[:5]

		self.update_serializer_obj_perms('question_perms')	

		return QuestionSerializer(questions, context=self.context, many=True).data
		
		
	def get_answers(self, obj):
		answers = Answer.objects.all()
		self.update_serializer_obj_perms('answer_perms')
		
		return AnswerReadSerializer(answers, context=self.context, many=True).data
	
	
	def get_posts(self, obj):
		posts = Post.objects.all()[:5]
		self.update_serializer_obj_perms('post_perms')

		return PostReadSerializer(posts, context=self.context, many=True).data

	def get_users(self, obj):
		self.update_serializer_obj_perms('user_perms')
		user = self.current_user()
		
		users = User.objects.exclude(
						first_name="Anonymous"
					).exclude(
					   id=user.id
					).filter(
						is_confirmed=True
					).filter(
						is_superuser=False
					)

		return UserSerializer(users, context=self.context, many=True).data
			
	
	
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
	

