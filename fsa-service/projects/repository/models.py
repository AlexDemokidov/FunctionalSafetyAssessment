import uuid
from datetime import datetime

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()


def generate_uuid():
    return str(uuid.uuid4())


class ProjectModel(Base):
    __tablename__ = "project"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, nullable=False)
    name = Column(String, nullable=False)
    sil = Column(String, nullable=False)
    analysis = Column(String, nullable=False)
    parameter1DirectlyProportional = Column(String, nullable=False)
    parameter1Min = Column(String, nullable=False)
    parameter1Max = Column(String, nullable=False)
    parameter2DirectlyProportional = Column(String, nullable=False)
    parameter2Min = Column(String, nullable=False)
    parameter2Max = Column(String, nullable=False)
    parameter3DirectlyProportional = Column(String, nullable=False)
    parameter3Min = Column(String, nullable=False)
    parameter3Max = Column(String, nullable=False)
    items = relationship("ProjectItemModel", backref="project")
    created = Column(DateTime, default=datetime.utcnow)

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
            "items": [item.dict() for item in self.items],
            "created": self.created,
        }


class ProjectItemModel(Base):
    __tablename__ = "project_item"

    id = Column(String, primary_key=True, default=generate_uuid)
    project_id = Column(String, ForeignKey("project.id"))
    name = Column(String, nullable=False)
    time = Column(String, nullable=False)
    parameter1 = Column(String, nullable=False)
    parameter2 = Column(String, nullable=False)
    parameter3 = Column(String, nullable=False)

    def dict(self):
        return {
            "id": self.id, 
            "name": self.name, 
            "time": self.time, 
            "parameter1": self.parameter1, 
            "parameter2": self.parameter2, 
            "parameter3": self.parameter3, 
        }