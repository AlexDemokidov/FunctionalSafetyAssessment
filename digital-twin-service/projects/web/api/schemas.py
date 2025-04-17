from datetime import datetime
from enum import Enum
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, Extra, conint, conlist, validator

class ProjectItemSchema(BaseModel):
    name: str
    time: str
    parameter1: str
    parameter2: str
    parameter3: str

    # class Config:
    #     extra = Extra.forbid

    @validator("name")
    def quantity_non_nullable(cls, value):
        assert value is not None, "name may not be None"
        return value


class CreateProjectSchema(BaseModel):
    name: str
    project: conlist(ProjectItemSchema, min_length=1)

    # class Config:
    #     extra = Extra.forbid


class GetProjectSchema(CreateProjectSchema):
    id: UUID
    name: str
    created: datetime

class GetProjectsSchema(BaseModel):
    projects: List[GetProjectSchema]

    class Config:
        extra = Extra.forbid
