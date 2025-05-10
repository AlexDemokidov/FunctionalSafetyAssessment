FROM python:3.9-slim

RUN mkdir -p /projects/projects

WORKDIR /projects

COPY requirements.txt /projects/requirements.txt

RUN pip install -U pip && pip install -r requirements.txt

RUN apt update && apt -y install libngspice0-dev

COPY projects/projects_service /projects/projects/projects_service/
COPY projects/repository /projects/projects/repository/
COPY projects/web /projects/projects/web/
COPY oas.yaml /projects/oas.yaml
COPY public_key.pem /projects/public_key.pem
COPY private.pem /projects/private.pem

EXPOSE 8000

CMD ["uvicorn", "projects.web.app:app", "--host", "0.0.0.0"]
