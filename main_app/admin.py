from django.contrib import admin
from django.contrib.auth.models import Group
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from mptt.admin import MPTTModelAdmin

from .models import *

# Register your models here.

class PostAdmin(admin.ModelAdmin):
    fields =  ['post','title', 'author','upvotes', 'deleted']

admin.site.register(Post,PostAdmin)


class CommentAdmin(admin.ModelAdmin):
    fields = ['comment', 'upvotes', 'author', 'post']

admin.site.register(Comment, CommentAdmin)


class CommentReplyAdmin(MPTTModelAdmin):
    fields = ['reply', 'upvotes', 'author', 'parent', 'comment' ]

admin.site.register(Reply, CommentReplyAdmin)



class QuestionAdmin(admin.ModelAdmin):
    fields = ['question', 'author', 'followers', 'updated', 'deleted' ]

admin.site.register(Question,QuestionAdmin)

class AnswerAdmin(admin.ModelAdmin):
    fields = ['answer','upvotes', 'author', 'question', 'updated', 'deleted']

admin.site.register(Answer, AnswerAdmin)



class AboutAdmin(admin.ModelAdmin):
    fields = ['about_title', 'about_post', 'about_text']

admin.site.register(AboutCompany, AboutAdmin)

class BugReportAdmin(admin.ModelAdmin):
    fields = ['full_name', 'email', 'subject', 'description']

admin.site.register(BugReport, BugReportAdmin)

        
class FeedBackAdmin(admin.ModelAdmin):
    fields = ['full_name', 'email', 'subject', 'description']

admin.site.register(FeedBack, FeedBackAdmin)

class AnswerBookmarkAdmin(admin.ModelAdmin):
    fields = ['answer', 'author', ]


admin.site.register(AnswerBookmark, AnswerBookmarkAdmin)

