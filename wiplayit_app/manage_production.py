#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys


def main():
    from dotenv import load_dotenv, find_dotenv
    # add your project directory to the sys.path
    project_home = '/home/Baloyi/wiplay-it-project/wiplayit_app/'
    print(load_dotenv(find_dotenv()))

    print(os.getenv('DATABASE_NAME'))
    print(os.getenv("DATABASE_PASSWORD"))
    print(os.getenv("DATABASE_HOST"))

    if project_home not in sys.path:
        project_folder = os.path.expanduser(project_home)
        print(project_folder)
        load_dotenv(os.path.join(project_folder, '.env'))
        sys.path.insert(0, project_folder)
        
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'wiplayit_app.settings.production')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        )

    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
