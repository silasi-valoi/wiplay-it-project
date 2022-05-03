
from main_app.views import (PostView, PostCommentView,
								PostReplyView, 
                               QuestionView, AnswerView,
                               AnswerCommentView, AnswerReplyView )
from main_app.mixins.views_mixins import  DestroyMixin



class DeleteQuestionView(DestroyMixin, QuestionView):
	pass
			
class DeleteAnswerView(DestroyMixin, AnswerView):
	pass
	

class DeleteAnswerCommentView(DestroyMixin, AnswerCommentView):
	pass

	
class DeleteAnswerReplyView(DestroyMixin, AnswerReplyView):
	pass

class DeletePostView(DestroyMixin, PostView):
	pass


class DeletePostCommentView(DestroyMixin, PostCommentView ):
	pass
	
class DeletePostReplyView(DestroyMixin, PostReplyView):
	pass


	