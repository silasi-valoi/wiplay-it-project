from django.contrib import admin
from django.contrib.auth.models import Group
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from mptt.admin import MPTTModelAdmin

#from .admin_forms import UserAdminCreationForm, UserAdminChangeForm
from .models import *

# Register your models here.
class DraftEditorMediaContentAdmin(admin.ModelAdmin):
    fields = ['draft_editor_file']

admin.site.register( DraftEditorMediaContent, DraftEditorMediaContentAdmin)

           

class PostAdmin(admin.ModelAdmin):
    fields =  ['ost','title', 'author','upvotes', 'deleted']

admin.site.register(Post,PostAdmin)



class CommentAdmin(admin.ModelAdmin):
    fields = ['comment', 'upvotes', 'author', 'post']

admin.site.register(Comment, CommentAdmin)


class CommentReplyAdmin(MPTTModelAdmin):
    fields = ['reply', 'upvotes', 'author', 'parent', 'comment' ]

admin.site.register(Reply, CommentReplyAdmin)



class QuestionAdmin(admin.ModelAdmin):
    fields = ['question', 'author', 'followers']

admin.site.register(Question,QuestionAdmin)



class AnswerAdmin(admin.ModelAdmin):
    fields = ['answer','upvotes', 'author', 'question']

admin.site.register(Answer, AnswerAdmin)

'''
class AnswerCommentAdmin(admin.ModelAdmin):
    fields = ['comment', 'upvotes', 'author', 'answer']

admin.site.register(AnswerComment,AnswerCommentAdmin)

class AnswerReplyAdmin(MPTTModelAdmin):
    fields = ['reply', 'upvotes', 'author', 'parent', 'comment' ]

admin.site.register(AnswerReply, AnswerReplyAdmin)
'''

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


'''
class FootballClubsAdmin(admin.ModelAdmin):
    fields = ['name', 'badge', 'followers']

admin.site.register(FootballClubs, FootballClubsAdmin)
'''
'''
class UserAdmin(BaseUserAdmin):
    # The forms to add and change user instances
    form = UserAdminChangeForm
    add_form = UserAdminCreationForm

    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin
    # that reference specific fields on auth.User.
    list_display = ('email', 'admin')
    list_filter = ('admin',)
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ()}),
        ('Permissions', {'fields': ('admin',)}),
    )
    # add_fieldsets is not a standard ModelAdmin attribute. UserAdmin
    # overrides get_fieldsets to use this attribute when creating a user.
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2')}
        ),
    )
    search_fields = ('email',)
    ordering = ('email',)
    filter_horizontal = ()


admin.site.register(User, UserAdmin)



# Remove Group Model from admin. We're not using it.
admin.site.unregister(Group)
'''
