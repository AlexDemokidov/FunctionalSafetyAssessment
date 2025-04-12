import requests

from projects.projects_service.exceptions import APIIntegrationError, InvalidActionError


class ProjectItem:
    def __init__(self, id, name, type, value, node1, node2, node3, node4, voltage, current, power, failure_rate, mtbf):
        self.id = id
        self.name = name
        self.type = type
        self.value = value
        self.node1 = node1
        self.node2 = node2
        self.node3 = node3
        self.node4 = node4
        self.voltage = voltage
        self.current = current
        self.power = power
        self.failure_rate = failure_rate
        self.mtbf = mtbf

    def dict(self):
        return {"name": self.name, "type": self.type, "value": self.value, "node1": self.node1, "node2": self.node2, "node3": self.node3, "node4": self.node4, "voltage": self.voltage, "current": self.current, "power": self.power, "failure_rate": self.failure_rate, "mtbf": self.mtbf }

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
