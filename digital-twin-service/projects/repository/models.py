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
    # name = Column(String, nullable=True)
    items = relationship("ProjectItemModel", backref="project")
    created = Column(DateTime, default=datetime.utcnow)

    def dict(self):
        return {
            "id": self.id,
            # "name": self.name,
            "items": [item.dict() for item in self.items],
            "created": self.created,
        }


class ProjectItemModel(Base):
    __tablename__ = "project_item"

    id = Column(String, primary_key=True, default=generate_uuid)
    project_id = Column(String, ForeignKey("project.id"))
    name = Column(String, nullable=True)
    type = Column(String, nullable=True)
    value = Column(String, nullable=False)
    node1 = Column(String, nullable=False)
    node2 = Column(String, nullable=False)
    node3 = Column(String, nullable=True)
    node4 = Column(String, nullable=True)
    voltage = Column(String, nullable=True)
    current = Column(String, nullable=True)
    power = Column(String, nullable=True)
    failure_rate = Column(String, nullable=True)
    mtbf = Column(String, nullable=True)

    def dict(self):
        return {
            "id": self.id, 
            "name": self.name, 
            "type": self.type, 
            "value": self.value, 
            "node1": self.node1, 
            "node2": self.node2, 
            "node3": self.node3, 
            "node4": self.node4, 
            "voltage": self.voltage, 
            "current": self.current, 
            "power": self.power, 
            "failure_rate": self.failure_rate, 
            "mtbf": self.mtbf 
        }