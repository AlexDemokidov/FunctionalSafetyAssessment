from typing import Optional
from uuid import UUID

from fastapi import HTTPException
from starlette import status
from starlette.requests import Request
from starlette.responses import Response

from projects.projects_service.exceptions import ProjectNotFoundError
from projects.projects_service.projects_service import ProjectsService
from projects.repository.projects_repository import ProjectsRepository
from projects.repository.unit_of_work import UnitOfWork
from projects.web.app import app
from projects.web.api.schemas import GetProjectSchema, CreateProjectSchema, GetProjectsSchema

from projects.projects_service.measure import measure


@app.get("/projects", response_model=GetProjectsSchema)
def get_projects(
    request: Request, limit: Optional[int] = None
):
    with UnitOfWork() as unit_of_work:
        repo = ProjectsRepository(unit_of_work.session)
        projects_service = ProjectsService(repo)
        results = projects_service.list_projects(
            limit=limit, user_id=request.state.user_id
        )
    return {"projects": [result.dict() for result in results]}


@app.post("/projects", status_code=status.HTTP_201_CREATED, response_model=GetProjectSchema)
def create_project(request: Request, payload: CreateProjectSchema):
    with UnitOfWork() as unit_of_work:
        repo = ProjectsRepository(unit_of_work.session)
        projects_service = ProjectsService(repo)
        project = payload.dict()["project"]
        project = projects_service.place_project(project, request.state.user_id)
        unit_of_work.commit()
        return_payload = project.dict()
    return return_payload


@app.get("/projects/{project_id}", response_model=GetProjectSchema)
def get_project(request: Request, project_id: UUID):
    try:
        with UnitOfWork() as unit_of_work:
            repo = ProjectsRepository(unit_of_work.session)
            projects_service = ProjectsService(repo)
            project = projects_service.get_project(
                project_id=project_id, user_id=request.state.user_id
            )
        return project.dict()
    except ProjectNotFoundError:
        raise HTTPException(
            status_code=404, detail=f"Project with ID {project_id} not found"
        )


@app.put("/projects/{project_id}", response_model=GetProjectSchema)
def update_project(request: Request, project_id: UUID, project_details: CreateProjectSchema):
    try:
        with UnitOfWork() as unit_of_work:
            repo = ProjectsRepository(unit_of_work.session)
            projects_service = ProjectsService(repo)
            project = project_details.dict()["project"]      
            project = measure(project)
            project = projects_service.update_project(
                project_id=project_id, items=project, user_id=request.state.user_id
            )
            unit_of_work.commit()
        return project.dict()
    except ProjectNotFoundError:
        raise HTTPException(
            status_code=404, detail=f"Project with ID {project_id} not found"
        )


@app.delete("/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT, response_class=Response)
def delete_project(request: Request, project_id: UUID):
    try:
        with UnitOfWork() as unit_of_work:
            repo = ProjectsRepository(unit_of_work.session)
            projects_service = ProjectsService(repo)
            projects_service.delete_project(project_id=project_id, user_id=request.state.user_id)
            unit_of_work.commit()
        return
    except ProjectNotFoundError:
        raise HTTPException(
            status_code=404, detail=f"Project with ID {project_id} not found"
        )

@app.put("/projects/{project_id}/measure", response_model=GetProjectSchema)
def measure_project(request: Request, project_id: UUID, project_details: CreateProjectSchema):
    try:
        with UnitOfWork() as unit_of_work:
            repo = ProjectsRepository(unit_of_work.session)
            projects_service = ProjectsService(repo)
            project = project_details.dict()["project"] 
            project = measure(project)
            project = projects_service.update_project(
                project_id=project_id, items=project, user_id=request.state.user_id
            )

            unit_of_work.commit()
        return project.dict()
    except ProjectNotFoundError:
        raise HTTPException(
            status_code=404, detail=f"Project with ID {project_id} not found"
        )