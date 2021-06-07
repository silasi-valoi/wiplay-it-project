import os
import json
from django.core.management.base import BaseCommand, CommandError
from auth_backend.models import User
from app_backend.models import Question, Answer
from auth_backend.custom_adapter import download_file_from_url
import MySQLdb as Database
from allauth.socialaccount.models import SocialAccount, SocialApp, SocialToken
from allauth.account.models import EmailAddress



class Command(BaseCommand):
    help = 'Get the specified user'

    #def add_arguments(self, parser):
    #    parser.add_argument('user_ids', nargs='+', type=int)

    def database_connect(self, *args, **kwargs):
        DATABASE_NAME = 'Baloyi$wiplayitdb'
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
        try:
            connection = self.database_connect()
            cursor = connection.cursor()
            
            self.extract_questions(cursor)
            self.extract_answers(cursor)
           
            cursor.connection.close()
        
        except Exception as e:
            raise e

        self.stdout.write(self.style.SUCCESS('Successfully'))

    def extract_questions(self, cursor):
        questions = "SELECT * FROM questions"
        cursor.execute(questions)
        columns = cursor.description
        results = cursor.fetchall()

        for k, row in enumerate(results):
            dict_results = dict()

            for i, value in enumerate(row):
                key = columns[i][0]
                dict_results[key] = value 

            print(dict_results)
            question, _ = Question.objects.get_or_create(**dict_results)
            print(question)
            print(' ')

    def extract_answers(self, cursor):
        answers = "SELECT * FROM answers"
        cursor.execute(answers)
        columns = cursor.description
        results = cursor.fetchall()

        for k, row in enumerate(results):
            dict_results = dict()

            for i, value in enumerate(row):
                key = columns[i][0]
                dict_results[key] = value 

            print(dict_results)
            answers, _ = Answer.objects.get_or_create(**dict_results)
            print(answers)
            print(' ')


    def extract_socialacconts(self, cursor):
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

            if socialaccount[0]:
                socialaccount = socialaccount[0]
                socialaccount.extra_data = extra_data
                socialaccount.save()

            else:
                dict_results.extra_data = extra_data
                socialaccount = SocialAccount.objects.get_or_create(**dict_results)

            avatar_url = socialaccount.get_avatar_url()
            avatar = download_file_from_url(avatar_url)
            user = socialaccount.user
            profile = user.profile
            profile.profile_picture = avatar
            profile.save()
           
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

            print(dict_results)
            social_app, _ = SocialApp.objects.get_or_create(**dict_results)
        

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

            print(dict_results)
            social_token, _ = SocialToken.objects.get_or_create(**dict_results)

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

            print(dict_results)
            email_address, _ = EmailAddress.objects.get_or_create(**dict_results)
            print(email_address)
            print(' ')
       

       