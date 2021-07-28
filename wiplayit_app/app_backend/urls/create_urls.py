
from django.urls import path
from app_backend.api_views.api_create_views import ( CreateQuestionView,
                                                     CreateAnswerView, 
                                                     CreateAnswerCommentView,
                                                     CreateAnswerReplyView, 
                                                     CreateAnswerReplyChildView,
                                                     CreatePostView,
                                                     AddAnswerBookMarkView,
                                                     AddPostBookMarkView,
                                                     DeleteAnswerBookMarkView,
                                                     DeletePostBookMarkView,
                                                     BugReportView,
                                                     FeedBackView,
                                                     ContactAdminView,
                                                     CreatePostCommentView, 
                                                     CreatePostReplyView, 
                                                     CreatePostReplyChildView,
                                                     CreateDraftEditorContentsView )


app_name = 'create_apis'

urlpatterns = [
	path("api/create/question/", 
        CreateQuestionView.as_view({'get':'get','post':'post' }), name="question_create"),
    
    path("api/create/post/",
        CreatePostView.as_view({'get':'get','post':'post' }), name="post_create"),
        
    path("api/create/question/<int:pk>/answer/",
        CreateAnswerView.as_view({'get':'get','post':'post' })),

    path("api/create/answer/<int:pk>/comment/",
        CreateAnswerCommentView.as_view({'get':'get','post':'post' })),

    path("api/create/answer/comment/<int:pk>/reply/", 
         CreateAnswerReplyView.as_view({'get':'get','post':'post' })),

    path("api/create/answer/reply/<int:pk>/child/",
         CreateAnswerReplyChildView.as_view({'get':'get','post':'post' })),

    path("api/draft/editor/contents/", 
        CreateDraftEditorContentsView.as_view({'get':'get','post':'post' })),

    path("api/create/post/<int:pk>/comment/", 
        CreatePostCommentView.as_view({'get':'get','post':'post' })),

    path("api/create/post/comment/<int:pk>/reply/", 
        CreatePostReplyView.as_view({'get':'get','post':'post' })),

    path("api/create/post/reply/<int:pk>/child/",
       CreatePostReplyChildView.as_view({'get':'get','post':'post' })),

    path("api/answer/<int:pk>/bookmark/add/",
       AddAnswerBookMarkView.as_view({'get':'get','post':'post' })),

    path("api/post/<int:pk>/bookmark/add/",
       AddPostBookMarkView.as_view({'get':'get','post':'post' })),

    path("api/answer/<int:pk>/bookmark/remove/",
       DeleteAnswerBookMarkView.as_view({'delete':'destroy'})),

    path("api/post/<int:pk>/bookmark/remove/",
      DeletePostBookMarkView.as_view({'delete':'destroy'})),

    path("api/bug/report/", BugReportView.as_view(), name="bug_report"),
    path("api/feedback/", FeedBackView.as_view(), name="feedback"),
    path("api/contact/admin/", ContactAdminView.as_view(), name="contact-admin"),
]

