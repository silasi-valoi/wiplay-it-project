from django.shortcuts import get_object_or_404
from main_app.models import AnswerBookmark, PostBookmark
from main_app.views import (AnswerBookmarkView, PostBookmarkView, PostView, PostCommentView,
								PostReplyView, 
                               QuestionView, AnswerView,
                               AnswerCommentView, AnswerReplyView )
from main_app.mixins.views_mixins import  DestroyMixin, DestroyModelMixin



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

   
class DeleteAnswerBookmarkView(DestroyModelMixin, AnswerBookmarkView):
	
	def get_object(self):
		return get_object_or_404(AnswerBookmark, answers_id=self.kwargs['pk'])

	
    
class DeletePostBookmarkView(DestroyModelMixin, PostBookmarkView):
	
	def get_object(self):
		return get_object_or_404(PostBookmark, posts_id=self.kwargs['pk'])



	