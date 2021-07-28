import os
import mptt
from PIL import Image
from django.conf import settings
from django.db import models 
from mptt.models import MPTTModel, TreeForeignKey

from app_backend.slug_generator import generate_unique_slug

class BaseModel(models.Model):
    deleted      = models.BooleanField('deleted', default=False)
    date_updated = models.DateTimeField(blank=True, null=True)
    date_created = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    author   = models.ForeignKey(
                       settings.AUTH_USER_MODEL,
                       on_delete=models.CASCADE, 
                       blank=True
                       )

    class Meta:
        abstract = True



#Quetion model
class Question(BaseModel):
    question = models.TextField('what is you question',  blank=True)
    slug         = models.SlugField(max_length=250, blank=True, unique=True)
    followers    = models.IntegerField(default=0)
    
    class Meta:
        permissions = (
                ('change_question_followers', 'Can Change Question Followers'),
        )
        db_table = "questions"


    #@models.permalink
    def get_absolute_url(self):
        from django.urls import reverse
        return reverse('retrieve_apis : question', args=[self.id, self.slug])

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_unique_slug(self.__class__, self.question)
        super().save(*args,**kwargs)

    def __str__(self):
        return self.question


    

class Answer(BaseModel):
    answer = models.TextField(null=True, blank=True)
    upvotes = models.IntegerField(default=0)
    question = models.ForeignKey(
                       Question,
                       on_delete=models.CASCADE,
                       related_name="answers",
                       blank=True
                    )
        

    class Meta:
        db_table = "answers"
        permissions = ( ('change_answer_upvotes', 'Can Change Answer  Upvotes'),)
                
    
    def __str__(self):
        return "{0}".format(self.answer)
        
        
    def get_absolute_url(self):
        from django.urls import reverse
        return reverse('question_app:answer-page', args=[self.id])


class Post(BaseModel):
    title  = models.CharField(max_length=250, blank=True)
    post   = models.TextField(null=True)
    slug       = models.SlugField(max_length=250, blank=True, unique=True)
    upvotes      = models.IntegerField(default=0)
    
    class Meta:
        db_table = "posts"
        permissions = ( ('change_post_upvotes', 'Can Change Post Uvotes'), )


    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_unique_slug(self.__class__, self.title)
        super().save(*args,**kwargs)

    def get_absolute_url(self):
        from django.urls import reverse
        return reverse('post_app:post-page', args=[self.slug])

    def __str__(self):
        return self.post




class Comment(BaseModel):
    comment = models.TextField(null=True)
    upvotes = models.IntegerField(default=0)
    answer = models.ForeignKey(
                    Answer,
                    on_delete=models.CASCADE, 
                    related_name="comments",
                    blank=True,
                    null=True
                )
    post = models.ForeignKey(
                    Post,
                    on_delete=models.CASCADE,
                    blank=True,
                    null=True,
                    related_name="comments"
                )
    
    class Meta:
        db_table = "comments"
        permissions = (
            ('change_comment_upvotes', 'Can Change Comment Uvotes'),
        )
                
                
    def __str__(self):
        return self.comment



class Reply(MPTTModel, BaseModel):
    reply = models.TextField(null=True, blank=True)
    upvotes = models.IntegerField(default=0)

    comment = models.ForeignKey(
                        Comment,
                        on_delete=models.CASCADE,
                        related_name="replies", 
                        blank=True,
                        null=True
                    )
    
    parent = TreeForeignKey(
                'self', on_delete=models.CASCADE, 
                null=True,
                blank=True,
                related_name='children'
            )
    
    class Meta:
        db_table = "replies"
        permissions = (
                ('change_reply_upvotes', 'Can Change Reply Uvotes'),
            )

    class MPTTMeta:
        order_insertion_by = ['parent']
        parent_attr = 'parent'

    
    def save(self, *args, **kwargs):
        if not self.id:
            Reply.objects.insert_node(self, self.parent)
        super(Reply, self).save(*args, **kwargs)
    


    def serializable_object(self):
        children = []
        for child in Reply.objects.filter(parent=self.pk):
            children.append(child)
        return children

    def children(self):
        return Reply.objects.filter(parent=self.pk)

    
    def __str__(self):
        return self.reply

class Bookmark(models.Model):
    author   = models.ForeignKey(
                        settings.AUTH_USER_MODEL,
                        on_delete=models.CASCADE,
                        null=True,
                        blank=True
                    )
    date_created  = models.DateTimeField(
                        auto_now_add=True,
                        null=True, 
                        blank=True
                    )
    class Meta:
        abstract = True
   

class AnswerBookmark(Bookmark):
    answer = models.ForeignKey(
                        Answer, 
                        on_delete=models.CASCADE,
                        blank=True, 
                        related_name="answers"
                    )
      
    class Meta:
        db_table = "answer_bookmark"

    def __str__(self):
        return self.answer.answer

    def save(self, *args, **kwargs):
        super().save()

class PostBookmark(Bookmark):
    post = models.ForeignKey(
                    Post, 
                    on_delete=models.CASCADE,
                    blank=True,
                    related_name="posts" 
                )

    class Meta:
        db_table = "post_bookmark"

    def __str__(self):
        return self.post.title




class AboutCompany(models.Model):
    about_title = models.CharField( max_length=250, blank=True)
    about_text  = models.TextField( blank=True)

    def __str__(self):
        return self.about_title


class TermsAndService(models.Model):
    terms    = models.TextField( blank=True)
    service  = models.TextField( blank=True)

    def __str__(self):
        return self.terms


    
class PrivacyAndPolicy(models.Model):
    policy    = models.TextField( blank=True)
    privacy   = models.TextField( blank=True)

    def __str__(self):
        return self.policy

class AdminMessage(models.Model):
    full_name  = models.CharField(max_length=50, blank=True, null=True)
    email      = models.CharField(max_length=50, blank=True, null=True)
    subject    = models.CharField(max_length=250, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    class Meta:
        db_table = "admin_messages" 
        abstract = True


    def __str__(self):
        return self.subject


class ContactAdmin(AdminMessage):

    class Meta:
        db_table = "contact_admin" 

class BugReport(AdminMessage):

    class Meta:
        db_table = "bug_reports"
       

class FeedBack(AdminMessage):

    class Meta:
        db_table = "feedbacks"
           

class FootballClubs(models.Model):
    name    = models.CharField(max_length=50, blank=True)
    badge   = models.ImageField(upload_to='badge_image/',blank=True)
    followers = models.IntegerField(default=0)


    PSL_FOOTBALL_CLUBS = (
            ('ACT','Ajax Cape town'),
            ('AMU','Amazulu'),
            ('BAR','Baroka'),
            ('BW','Bidvest Wits'),
            ('BFC', 'Bloemfontein Celtic'),
            ('CTC', 'Cape Town city'),
            ('CHU', 'Chippa United'),
            ('FS', 'Free State stars'),
            ('GD', 'Golden Arrows'),
            ('KC', 'Kaizer Chiefs'),
            ('MU', 'Maritzburg United'),
            ('MS', 'Mamelodi Sundowns'),
            ('OP', 'Orlando Pirates'),
            ('PS', 'Platnum Stars'),
            ('PC', 'Polokwane City'),
            ('SU', 'SuperSport United'),
            )

    def __str__(self):
        return self.name


    class Meta:
         permissions = (

                ('change_followers', 'Can Change Followers'),
                )

 

class DraftEditorMediaContent(models.Model):

    #Stores draft editor content files 
    def get_upload_path(self, filename):
        return os.path.join('draft-editor-files', filename) 

    draft_editor_file = models.FileField(upload_to=get_upload_path, null=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL,
                              on_delete=models.CASCADE, 
                              blank=True, null=True) 


    class Meta:
        db_table = "draft_editor_contents"
        permissions = (
            ('view_draft_editor_files', 'Can View Draft Editor Files'),
            ('edit_draft_editor_files', 'Can Edit Draft Editor Files'),
            ('delete_draft_editor_files', 'Can Delete Draft Editor Files'),
        )
    
    def __str__(self):
        return "{0}".format(self.id)


class DefaultProfilePicture(models.Model):
    profile_picture = models.ImageField(
                        upload_to='profiles/%y/%m/%d/',
                        blank=True,
                        default="default-profiles/user-image-placeholder.png"
                      )
