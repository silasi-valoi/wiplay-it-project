
from main_app.views import (PostView, PostCommentView,
								PostReplyView, 
                               QuestionView, AnswerView,
                               AnswerCommentView, AnswerReplyView )
from main_app.mixins.views_mixins import  UpdateObjectMixin
from main_app.admin_api.views import AboutView 


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


	