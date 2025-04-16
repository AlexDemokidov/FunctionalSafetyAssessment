# Запуск сервиса
sudo pip install -U pip && sudo pip install -r requirements.txt
sudo apt update && sudo apt -y install libngspice0-dev
sudo apt install uvicorn
uvicorn projects.web.app:app --host 0.0.0.0
