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
    sil: str
    analysis: str
    parameter1DirectlyProportional: str
    parameter1Min: str
    parameter1Max: str
    parameter2DirectlyProportional: str
    parameter2Min: str
    parameter2Max: str
    parameter3DirectlyProportional: str
    parameter3Min: str
    parameter3Max: str
    project: conlist(ProjectItemSchema, min_length=1)

    # class Config:
    #     extra = Extra.forbid


class GetProjectSchema(CreateProjectSchema):
    id: UUID
    name: str
    sil: str
    analysis: str
    parameter1DirectlyProportional: str
    parameter1Min: str
    parameter1Max: str
    parameter2DirectlyProportional: str
    parameter2Min: str
    parameter2Max: str
    parameter3DirectlyProportional: str
    parameter3Min: str
    parameter3Max: str
    created: datetime

class GetProjectsSchema(BaseModel):
    projects: List[GetProjectSchema]

    class Config:
        extra = Extra.forbid

class GetModelSchema(BaseModel):
    beta1: str
    eta1: str
    beta2: str
    eta2: str
    lambda1: str
    gamma1: str
    gamma2: str
    gamma3: str
    mttf: str
    pfh: str
    sil: str

    # class Config:
    #     extra = Extra.forbid