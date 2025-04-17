from projects.projects_service.projects import Project
from projects.repository.models import ProjectModel, ProjectItemModel


class ProjectsRepository:
    def __init__(self, session):
        self.session = session

    def add(self, items, user_id, name, sil, analysis, parameter1DirectlyProportional, parameter1Min, parameter1Max, parameter2DirectlyProportional, parameter2Min, parameter2Max, parameter3DirectlyProportional, parameter3Min, parameter3Max):
        record = ProjectModel(
            items=[ProjectItemModel(**item) for item in items], user_id=user_id, name=name, sil=sil, analysis=analysis, parameter1DirectlyProportional=parameter1DirectlyProportional, parameter1Min=parameter1Min, parameter1Max=parameter1Max, parameter2DirectlyProportional=parameter2DirectlyProportional, parameter2Min=parameter2Min, parameter2Max=parameter2Max, parameter3DirectlyProportional=parameter3DirectlyProportional, parameter3Min=parameter3Min, parameter3Max=parameter3Max
        )
        self.session.add(record)
        return Project(**record.dict(), project_=record)

    def _get(self, id_, **filters):
        return (
            self.session.query(ProjectModel)
            .filter(ProjectModel.id == str(id_))
            .filter_by(**filters)
            .first()
        )

    def get(self, id_, **filters):
        project = self._get(id_, **filters)
        if project is not None:
            return Project(**project.dict())

    def list(self, limit=None, **filters):
        query = self.session.query(ProjectModel)
        records = query.filter_by(**filters).limit(limit).all()
        return [Project(**record.dict()) for record in records]

    def update(self, id_, **payload):
        record = self._get(id_)
        if "items" in payload:
            for item in record.items:
                self.session.delete(item)
            record.items = [ProjectItemModel(**item) for item in payload.pop("items")]
        for key, value in payload.items():
            setattr(record, key, value)
        return Project(**record.dict())

    def delete(self, id_):
        self.session.delete(self._get(id_))
