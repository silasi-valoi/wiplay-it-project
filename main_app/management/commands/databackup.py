import os
import json
from sqlite3 import connect
from django.core.management.base import BaseCommand, CommandError

import MySQLdb as Database
from MySQLdb._exceptions import ProgrammingError 
from allauth.socialaccount.models import SocialAccount, SocialApp, SocialToken
from allauth.account.models import EmailAddress
from django.contrib.sites.models import Site
from main_app.models import *
from auth_app.models import User, PhoneNumber
from auth_app.adapter import download_file_from_url

def upload_social_account_avatar(socialaccount=None):
    if not socialaccount:
        return

    avatar_url = socialaccount.get_avatar_url()
    avatar = download_file_from_url(avatar_url)

    user = socialaccount.user

    profile = user.profile
    profile.profile_picture = avatar
    profile.save()

    

class Command(BaseCommand):
    help = 'Backup data from another database to another'
    database_name = None
    database_table = None
    social_accounts = None
    previous_users = None


    def add_arguments(self, parser):
        parser.add_argument('database_name', nargs='+', type=str)
                 
        parser.add_argument(
            '--old_tables',
            action='store_true',
            help='Search old database table.',
        )
        
      
    def database_connect(self, *args, **kwargs):
    
        self.database_name = args[0]
        
        DATABASE_NAME =  self.database_name
        DATABASE_USER = os.getenv("DATABASE_USER")
        DATABASE_PASSWORD = os.getenv("DATABASE_PASSWORD")
        DATABASE_HOST = os.getenv('DATABASE_HOST')

    
        return Database.connect(
            host=DATABASE_HOST,
            user=DATABASE_USER,
            passwd=DATABASE_PASSWORD,
            database=DATABASE_NAME
        )

    def handle(self, *args, **options):
                    
        for database in options['database_name']:
            try:
                connection = self.database_connect(database)
            except Exception as e:
                raise CommandError('The database "%s" does not exist' % database)


            cursor = connection.cursor()
            
            self.extract_users(cursor)
            self.extract_socialapps(cursor)
            self.extract_socialaccounts(cursor)
            
            self.extract_socialtokens(cursor)
            self.extract_email_address(cursor)
            self.extract_phone_numbers(cursor)
            self.extract_posts(cursor)
            
            self.extract_questions(cursor)
            self.extract_answers(cursor)

            if options['old_tables']:
                self.extract_comments(cursor, 'answer_comments')
                self.extract_replies(cursor, 'post_replies')
                self.extract_comments(cursor, 'post_comments')
                self.extract_replies(cursor, 'answer_replies')
            else:
                self.extract_comments(cursor, 'comments')
                self.extract_replies(cursor, 'replies')
                        
      
            cursor.connection.close()
                  
            self.stdout.write(self.style.SUCCESS('Successfully'))


    def get_query(self, cursor, query):
        try:
            cursor.execute(query)
            columns = cursor.description
            results = cursor.fetchall()
            return (results, columns) 

        except:
            raise ProgrammingError(
                "Table {0}.{1} does not exist".format(self.database_name, self.database_table)
            )

    def serialize_data_query(self, cursor, query):
        data = []
        results, columns = self.get_query(cursor, query)

        for k, row in enumerate(results):
            dict_results = dict()

            for i, value in enumerate(row):
                key = columns[i][0]
                if key == 'add_post':
                    key = 'post'

                elif key == 'add_title':
                    key = 'title'

                elif key == 'add_question':
                    key = 'question'

                elif key == 'add_answer':
                    key = 'answer'

                elif key == 'primary_number':
                    key = 'phone_number'

                dict_results[key] = value
            
            data.append(dict_results)
        
        return data

  
    def data_exist(self, model, data) -> bool:
        return model.objects.filter(**data).exists()

    def get_user(self, id):
        users = self.previous_users
        user = None

        for u in users:
            if u.get('id', None) == id:
                search_data = {
                    "email":u['email'],
                   "first_name":u['first_name'],
                    "last_name":u['last_name'],
                }
                
                if  self.data_exist(User, search_data):
                    user = User.objects.get(**search_data)
                    return user

        return user


    def extract_posts(self, cursor):
        self.database_table = 'posts'
        query = "SELECT * FROM posts"
        posts = self.serialize_data_query(cursor, query)
        
        for post in posts:
            user = self.get_user(post['author_id'])
            if user:
                post['author_id'] = user.id

            search_data = {
                "post":post['post'],
                "slug":post['slug'],
                "author_id":post['author_id']
            }

            if not self.data_exist(Post, search_data):
                self.save(Post,  post)

           

    def extract_questions(self, cursor):
        query = "SELECT * FROM questions"
        self.database_table = 'questions'
        questions = self.serialize_data_query(cursor, query)

        for question in questions:
            user = self.get_user(question['author_id'])
            if user:
                question['author_id'] = user.id

            search_data = {
                "question":question['question'],
                "slug":question['slug'],
                "author_id":question['author_id']
            }
            if not self.data_exist(Question, search_data):
                self.save(Question, question)

    
    def extract_answers(self, cursor):
        query = "SELECT * FROM answers"
        self.database_table = 'answers'
    
        answers = self.serialize_data_query(cursor, query) 

        for answer in answers:
            user = self.get_user(answer['author_id'])
            
            if user:
                answer['author_id'] = user.id
            
            search_data = {
                "answer":answer['answer'],
                "author_id":answer['author_id']
            }

            if not self.data_exist(Answer, search_data):
                self.save(Answer, answer)
            

    def extract_comments(self, cursor, table_name):
             
        query = "SELECT * FROM {0}".format(table_name)
        self.database_table = table_name
        comments = self.serialize_data_query(cursor, query)
        #print(comments)
        for comment in comments:
            user = self.get_user(comment['author_id'])

            if user:
                comment['author_id'] = user.id

            search_data = {
                "comment":comment['comment'],
                "author_id":comment['author_id']
            }

            if not self.data_exist(Comment, search_data):
                self.save(Comment, comment)
    
        
    def extract_replies(self, cursor, table_name=None):
        if table_name == None:
            table_name = 'replies'

        query = "SELECT * FROM {0}".format(table_name)

        self.database_table = table_name
        replies = self.serialize_data_query(cursor, query)

        for reply in replies:
            user = self.get_user(reply['author_id'])
            
            if user:
                reply['author_id'] = user.id

            search_data = {"reply":reply['reply'], "author_id":reply['author_id']}
            
            if not self.data_exist(Reply, search_data):
                #self.save(Reply, reply)
                pass
 


    def extract_users(self, cursor):
                
        self.database_table = 'users'
        query = "SELECT * FROM users"
        users = self.serialize_data_query(cursor, query)
        self.previous_users = users
        
        for user in users:
            user.pop('country', False)
            email = user['email']
            search_data = {"email":email}
            if not self.data_exist(User, search_data):
                self.save(User, user)

                   
    def extract_socialaccounts(self, cursor):
        query = "SELECT * FROM socialaccount_socialaccount"
        self.database_table = 'users'
        self.social_accounts = self.serialize_data_query(cursor, query)
        
        for account in self.social_accounts:

            extra_data = account['extra_data']
            extra_data = json.loads(extra_data)
            

            uid = account['uid']
            user_id = account['user_id']
            provider = account['provider']
            user = self.get_user(user_id)
            if user:
                account['user_id'] = user.id
                user_id = user.id

            search_data = {"uid":uid, "user_id":user_id, "provider":provider}

            if not self.data_exist(SocialAccount, search_data):
                account['extra_data'] = extra_data
                account = self.save(SocialAccount, account)

                upload_social_account_avatar(account) 
                
              
                  
    def extract_socialapps(self, cursor):
        query = "SELECT * FROM socialaccount_socialapp"
        self.database_table = 'socialaccount_socialapp'
        social_apps = self.serialize_data_query(cursor, query)

        for app in social_apps:
           
            search_data = {
                "provider":app['provider'],
                "name":app['name'],
                "client_id":app['client_id'],
                "secret":app['secret']
            }

            if not self.data_exist(SocialApp, search_data):
                self.save(SocialApp, app)

        

    def extract_socialtokens(self, cursor):
        query = "SELECT * FROM socialaccount_socialtoken"
        self.database_table = 'socialaccount_socialtoken'
        social_tokens = self.serialize_data_query(cursor, query)
        accounts = self.social_accounts
        
        for token in social_tokens:
                        
            search_data = {
                "app":token['app_id'],
                "account":token['account_id'],
                "token":token['token'],
                "token_secret":token['token_secret']

            }
            if not self.data_exist(SocialToken, search_data):
                self.save(SocialToken, token)
         
    def extract_email_address(self, cursor):
        query = "SELECT * FROM account_emailaddress"
        self.database_table = 'account_emailaddress'
        email_address = self.serialize_data_query(cursor, query)

        for email in email_address:
            user = self.get_user(email['user_id'])
            if user:
                email['user_id'] = user.id
                
            search_data = {
                "email":email['email'],
                "user_id":email['user_id'],

            }
            if not self.data_exist(EmailAddress, search_data):
                self.save(EmailAddress, email)

    def extract_sites(self, cursor):
        query = "SELECT * FROM django_site"
        self.database_table = 'django_site'
        sites = self.serialize_data_query(cursor, query)

        for site in sites:
            search_data = {
                "domain":site['domain'],
                "name":site['name']
            }
            if not self.data_exist(Site, search_data):
                self.save(Site, site)


           
    def extract_phone_numbers(self, cursor):
        query = "SELECT * FROM users_phone_numbers"
        self.database_table = 'users_phone_numbers'
        phone_numbers = self.serialize_data_query(cursor, query)

        for phone_number in phone_numbers:
            user = self.get_user(phone_number['user_id'])
            if user:
                phone_number['user_id'] = user.id

            search_data = {
                "phone_number":phone_number['phone_number'],
                "user_id":phone_number['user_id']
            }

            if not self.data_exist(PhoneNumber, search_data):
                self.save(PhoneNumber, phone_number)
        
          

    def save(self, model, data):
        data.pop('id', False)
        
        try:
            data, created = model.objects.get_or_create(**data)
            if created:
                return data
            else:
                return None
                
        except Exception as error:
            raise ProgrammingError(error)

        
            
                     