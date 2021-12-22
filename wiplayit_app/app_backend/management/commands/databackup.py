import os
import json
from django.core.management.base import BaseCommand, CommandError

import MySQLdb as Database
from allauth.socialaccount.models import SocialAccount, SocialApp, SocialToken
from allauth.account.models import EmailAddress

from app_backend.models import *
from app_backend.registrations.adapter import download_file_from_url


class Command(BaseCommand):
    help = 'Backup data from another database to another'

    def add_arguments(self, parser):
        parser.add_argument('database_name', nargs='+', type=str)

    def database_connect(self, *args, **kwargs):
        
        DATABASE_NAME =  args[0]
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
            #self.extract_comments(cursor)
            #self.extract_replies(cursor)
      
            cursor.connection.close()
                  
            self.stdout.write(self.style.SUCCESS('Successfully'))

    def extract_posts(self, cursor):
        posts = "SELECT * FROM posts"
        cursor.execute(posts)
        columns = cursor.description
        results = cursor.fetchall()

        for k, row in enumerate(results):
            dict_results = dict()

            for i, value in enumerate(row):
                key = columns[i][0]
                if key == 'add_post':
                    key = 'post'

                if key == 'add_title':
                    key = 'title'

                dict_results[key] = value 

            self.save(Question, dict_results)
           

    def extract_questions(self, cursor):
        questions = "SELECT * FROM questions"
        cursor.execute(questions)
        columns = cursor.description
        results = cursor.fetchall()

        for k, row in enumerate(results):
            dict_results = dict()

            for i, value in enumerate(row):
                key = columns[i][0]

                if key == 'add_question':
                    key = 'question'

                dict_results[key] = value 

            self.save(Question, dict_results)


    def extract_answers(self, cursor):
        answers = "SELECT * FROM answers"
        cursor.execute(answers)
        columns = cursor.description
        results = cursor.fetchall()

        for k, row in enumerate(results):
            dict_results = dict()

            for i, value in enumerate(row):
                key = columns[i][0]
                if key == 'add_answer':
                    key = 'answer'
                dict_results[key] = value 
            self.save(Answer, dict_results)
            

    def extract_comments(self, cursor):
        comments = "SELECT * FROM comments"
        cursor.execute(comments)
        columns = cursor.description
        results = cursor.fetchall()

        for k, row in enumerate(results):
            dict_results = dict()

            for i, value in enumerate(row):
                key = columns[i][0]
                dict_results[key] = value 
            self.save(Comment, dict_results)

        
    def extract_replies(self, cursor):
        replies = "SELECT * FROM replies"
        cursor.execute(replies)
        columns = cursor.description
        results = cursor.fetchall()

        for k, row in enumerate(results):
            dict_results = dict()

            for i, value in enumerate(row):
                key = columns[i][0]
                dict_results[key] = value 

            self.save(Reply, dict_results)
 


    def extract_users(self, cursor):
        users = "SELECT * FROM users"
        cursor.execute(users)
        columns = cursor.description
        results = cursor.fetchall()

        for k, row in enumerate(results):
            dict_results = dict()

            for i, value in enumerate(row):
                key = columns[i][0]
                dict_results[key] = value 

            self.save(User, dict_results)

           
    def extract_socialaccounts(self, cursor):
        socialaccounts = "SELECT * FROM socialaccount_socialaccount"

        cursor.execute(socialaccounts)
        columns = cursor.description
        results = cursor.fetchall()

        for k, row in enumerate(results):
            dict_results = dict()

            for i, value in enumerate(row):
                key = columns[i][0]
                dict_results[key] = value 

            
            user_id = dict_results['id'] 
            extra_data = dict_results['extra_data']
            extra_data = json.loads(extra_data)
            socialaccount = SocialAccount.objects.filter(id=user_id)

            i=0
            while i < len(socialaccount):
                socialaccount = socialaccount[0]
                if socialaccount:
                    
                    socialaccount.extra_data = extra_data
                    socialaccount.save()

                else:
                    dict_results.extra_data = extra_data
                    socialaccount = self.save(SocialAccount, dict_results)
                    

                avatar_url = socialaccount.get_avatar_url()
                avatar = download_file_from_url(avatar_url)
                user = socialaccount.user
                profile = user.profile
                profile.profile_picture = avatar
                profile.save()

                i += 1
           
    def extract_socialapps(self, cursor):
        socialaccount_apps = "SELECT * FROM socialaccount_socialapp"
        cursor.execute(socialaccount_apps)
        columns = cursor.description
        results = cursor.fetchall()

        for k, row in enumerate(results):
            dict_results = dict()

            for i, value in enumerate(row):
                key = columns[i][0]
                dict_results[key] = value 

            self.save(SocialApp, dict_results)

        

    def extract_socialtokens(self, cursor):
        socialaccount_socialtoken = "SELECT * FROM socialaccount_socialtoken"
        cursor.execute(socialaccount_socialtoken)
        columns = cursor.description
        results = cursor.fetchall()

        for k, row in enumerate(results):
            dict_results = dict()

            for i, value in enumerate(row):
                key = columns[i][0]
                dict_results[key] = value 
            print("SocialToken")

            print(dict_results)

            self.save(SocialToken, dict_results)
         
    def extract_email_address(self, cursor):
        email_address = "SELECT * FROM account_emailaddress"
        cursor.execute(email_address)
        columns = cursor.description
        results = cursor.fetchall()

        for k, row in enumerate(results):
            dict_results = dict()

            for i, value in enumerate(row):
                key = columns[i][0]
                dict_results[key] = value

            self.save(EmailAddress, dict_results)

           
    def extract_phone_numbers(self, cursor):
        email_address = "SELECT * FROM users_phone_numbers"
        cursor.execute(email_address)
        columns = cursor.description
        results = cursor.fetchall()

        for k, row in enumerate(results):
            dict_results = dict()

            for i, value in enumerate(row):
                key = columns[i][0]
                dict_results[key] = value 

            self.save(PhoneNumber, dict_results)
          

    def save(self, model, data):
        print(data)
        if data['created_at']:
            return
        data_id = data['id'] 
        data_query = model.objects.filter(id=data_id)

        if len(data_query) == 0:
            return model.objects.get_or_create(**data)
            
       
       

       