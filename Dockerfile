FROM python:3

ARG USER=root

USER $USER

#RUN python3 -m venv wiplayit_env

WORKDIR /wiplayit_app

COPY requirements.txt /wiplayit_app/

RUN pip install -r requirements.txt

COPY . /wiplayit_app/

COPY .env /.env

LABEL Silasi Valoi <valoi.pythonanywhere.com>

ENV PYTHONUNBUFFERED=1

EXPOSE 8000


CMD [ "python", "manage.py", "runserver", "0.0.0.0:8000" ]