import requests

from projects.projects_service.exceptions import APIIntegrationError, InvalidActionError


class ProjectItem:
    def __init__(self, id, name, time, parameter1, parameter2, parameter3):
        self.id = id
        self.name = name
        self.time = time
        self.parameter1 = parameter1
        self.parameter2 = parameter2
        self.parameter3 = parameter3

    def dict(self):
        return {"name": self.name, "time": self.time, "parameter1": self.parameter1, "parameter2": self.parameter2, "parameter3": self.parameter3}

class Project:
    def __init__(
        self,
        id,
        # name,
        created,
        items,
        project_=None,
    ):
        self._project = project_
        self._id = id
        # self._name = name
        self._created = created
        self.items = [ProjectItem(**item) for item in items]

    @property
    def id(self):
        return self._id or self._project.id
    
    # @property
    # def name(self):
    #     return self._name or self._project.name

    @property
    def created(self):
        return self._created or self._project.created

    def dict(self):
        return {
            "id": self.id,
            # "name": self.name,
            "project": [item.dict() for item in self.items],
            "created": self.created,
        }
