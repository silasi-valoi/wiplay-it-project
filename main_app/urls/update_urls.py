from django.urls import path

from main_app.api_views.api_delete_views import (DeleteQuestionView,
                                                    DeleteAnswerView,
                                                    DeleteAnswerCommentView,
                                                    DeleteAnswerReplyView,
                                                    DeletePostView,
                                                    DeletePostCommentView,
                                                    DeletePostReplyView)

from main_app.api_views.api_update_views import (UpdateQuestionView, 
                                                    UpdateAnswerView,
                                                    UpdateAnswerCommentView,
                                                    UpdateAnswerReplyView,
                                                    UpdatePostView,
                                                    UpdatePostCommentView,
                                                    UpdatePostReplyView)

app_name = 'update_apis'



urlpatterns = [
		
     path("api/question/<int:pk>/edit/", 
             UpdateQuestionView.as_view({'get':'retrieve','put':'put' })),

     path("api/answer/<int:pk>/edit/",
             UpdateAnswerView.as_view({'get':'retrieve','put':'put' })),

     path("api/answer/comment/<int:pk>/edit/",
             UpdateAnswerCommentView.as_view({'get':'retrieve','put':'put' })),

     path("api/answer/reply/<int:pk>/edit/", 
             UpdateAnswerReplyView.as_view({'get':'retrieve','put':'put' })),


     path("api/post/<int:pk>/edit/", 
            UpdatePostView.as_view({'get':'retrieve','put':'put' })),

     path("api/post/comment/<int:pk>/edit/",
            UpdatePostCommentView.as_view({'get':'retrieve','put':'put' })),
        
     path("api/post/reply/<int:pk>/edit/", 
            UpdatePostReplyView.as_view({'get':'retrieve','put':'put' })),


     path("api/question/<int:pk>/delete/", 
              DeleteQuestionView.as_view({'delete':'destroy'})),

     path("api/answer/<int:pk>/delete/", 
             DeleteAnswerView.as_view({'delete':'destroy'})),  

     path("api/answer/comment/<int:pk>/delete/",
             DeleteAnswerCommentView.as_view({'delete':'destroy'})), 

     path("api/answer/reply/<int:pk>/delete/", 
             DeleteAnswerReplyView.as_view({'delete':'destroy'})),


     path("api/post/<int:pk>/delete/", 
            DeletePostView.as_view({'delete':'destroy' })),

     path("api/post/comment/<int:pk>/delete/",
            DeletePostCommentView.as_view({'delete':'destroy' })),
        
     path("api/post/reply/<int:pk>/delete/", 
            DeletePostReplyView.as_view({'delete':'destroy'})),
]

