import os
from django.core.management.base import BaseCommand, CommandError
from auth_backend.models import User
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
            
            socialaccount_apps = "SELECT * FROM socialaccount_socialapp"
            socialaccount_socialtoken = "SELECT * FROM socialaccount_socialtoken"
            self.extract_socialacconts(cursor)
           
            cursor.connection.close()
        
        except Exception as e:
            raise e

        self.stdout.write(self.style.SUCCESS('Successfully'))


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

            print(dict_results)

    def extract_socialapps(self, cursor):
        pass

    def extract_socialtokens(self, cursor):
        pass
       

       