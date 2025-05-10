# Установка зависимостей
sudo pip install -U pip && sudo pip install -r requirements.txt
sudo apt update && sudo apt -y install libngspice0-dev
sudo apt install uvicorn

# Инициализация БД
PYTHONPATH=`pwd`
DB_URL=postgresql://postgres:postgres@localhost:5432/postgres
alembic upgrade heads

alex@DESKTOP-76F7GVQ:~/FunctionalSafetyAssessment/fsa-service$ alembic upgrade heads
INFO  [alembic.runtime.migration] Context impl PostgresqlImpl.
INFO  [alembic.runtime.migration] Will assume transactional DDL.
INFO  [alembic.runtime.migration] Running upgrade  -> bd1046019404, Initial migration
INFO  [alembic.runtime.migration] Running upgrade bd1046019404 -> cf6a8fb1fd44, Add user id to project table

# Запуск сервиса
uvicorn projects.web.app:app --reload
