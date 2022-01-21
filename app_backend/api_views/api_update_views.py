
from app_backend.views import (PostView, PostCommentView,
								PostReplyView, 
                               QuestionView, AnswerView,
                               AnswerCommentView, AnswerReplyView )
from app_backend.mixins.views_mixins import  UpdateObjectMixin
from app_backend.admin_api.views import AboutView 


class UpdateAboutView(UpdateObjectMixin, AboutView):
	pass

class UpdateQuestionView(UpdateObjectMixin, QuestionView):
	pass
			
		
	
class UpdateAnswerView(UpdateObjectMixin, AnswerView):
	pass
	


class UpdateAnswerCommentView(UpdateObjectMixin, AnswerCommentView):
	pass

	
class UpdateAnswerReplyView(UpdateObjectMixin, AnswerReplyView):
	pass





class UpdatePostView(UpdateObjectMixin, PostView):
	pass


class UpdatePostCommentView(UpdateObjectMixin, PostCommentView ):
	pass
	
class UpdatePostReplyView(UpdateObjectMixin, PostReplyView):
	pass


	