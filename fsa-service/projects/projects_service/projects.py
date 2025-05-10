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
        name,
        sil,
        analysis,
        parameter1DirectlyProportional,
        parameter1Min,
        parameter1Max,
        parameter2DirectlyProportional,
        parameter2Min,
        parameter2Max,
        parameter3DirectlyProportional,
        parameter3Min,
        parameter3Max,
        created,
        items,
        project_=None,
    ):
        self._project = project_
        self._id = id
        self._name = name
        self._sil = sil
        self._analysis = analysis
        self._parameter1DirectlyProportional = parameter1DirectlyProportional
        self._parameter1Min = parameter1Min
        self._parameter1Max = parameter1Max
        self._parameter2DirectlyProportional = parameter2DirectlyProportional
        self._parameter2Min = parameter2Min
        self._parameter2Max = parameter2Max
        self._parameter3DirectlyProportional = parameter3DirectlyProportional
        self._parameter3Min = parameter3Min
        self._parameter3Max = parameter3Max
        self._created = created
        self.items = [ProjectItem(**item) for item in items]

    @property
    def id(self):
        return self._id or self._project.id
    
    @property
    def name(self):
        return self._name or self._project.name
    
    @property
    def created(self):
        return self._created or self._project.created
    
    @property
    def sil(self):
        return self._sil or self._project.sil

    @property
    def analysis(self):
        return self._analysis or self._project.analysis
    
    @property
    def parameter1DirectlyProportional(self):
        return self._parameter1DirectlyProportional or self._project.parameter1DirectlyProportional

    @property
    def parameter1Min(self):
        return self._parameter1Min or self._project.parameter1Min
    
    @property
    def parameter1Max(self):
        return self._parameter1Max or self._project.parameter1Max
    
    @property
    def parameter2DirectlyProportional(self):
        return self._parameter2DirectlyProportional or self._project.parameter2DirectlyProportional

    @property
    def parameter2Min(self):
        return self._parameter2Min or self._project.parameter2Min
    
    @property
    def parameter2Max(self):
        return self._parameter2Max or self._project.parameter2Max

    @property
    def parameter3DirectlyProportional(self):
        return self._parameter3DirectlyProportional or self._project.parameter3DirectlyProportional

    @property
    def parameter3Min(self):
        return self._parameter3Min or self._project.parameter3Min
    
    @property
    def parameter3Max(self):
        return self._parameter3Max or self._project.parameter3Max

    def dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "sil": self.sil,
            "analysis": self.analysis,
            "parameter1DirectlyProportional": self.parameter1DirectlyProportional,
            "parameter1Min": self.parameter1Min,
            "parameter1Max": self.parameter1Max,
            "parameter2DirectlyProportional": self.parameter2DirectlyProportional,
            "parameter2Min": self.parameter2Min,
            "parameter2Max": self.parameter2Max,
            "parameter3DirectlyProportional": self.parameter3DirectlyProportional,
            "parameter3Min": self.parameter3Min,
            "parameter3Max": self.parameter3Max,
            "project": [item.dict() for item in self.items],
            "created": self.created,
        }
