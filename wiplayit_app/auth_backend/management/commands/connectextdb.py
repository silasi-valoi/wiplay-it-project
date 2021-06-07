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
        DATABASE_NAME = os.getenv('DATABASE_NAME')
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
            socialaccounts = "SELECT * FROM socialaccount_socialaccount"
            socialaccount_apps = "SELECT * FROM socialaccount_socialapp"
            socialaccount_socialtoken = "SELECT * FROM socialaccount_socialtoken"


            cursor.execute(socialaccounts)
            columns = cursor.description
            results = cursor.fetchall()

            list_results = []
            for k, row in enumerate(results):
                dict_results = dict()

                for i, value in enumerate(row):
                    key = columns[i][0]
                    dict_results[key] = value 

                list_results.append(dict_results)

            print(list_results)
            cursor.connection.close()
        
        except Exception as e:
            raise e

        self.stdout.write(self.style.SUCCESS('Successfully'))
       

        #self.stdout.write('Database connection is {0}'.format(connection))
        
        '''
        for user_id in options['user_ids']:
            try:
                user = User.objects.get(pk=user_id)
            except User.DoesNotExist:
                raise CommandError('User "%s" does not exist' % user_id)

            
            self.stdout.write(self.style.SUCCESS('Successfully got user "%s"' % user_id))
        '''