from projects.projects_service.exceptions import ProjectNotFoundError
from projects.repository.projects_repository import ProjectsRepository


class ProjectsService:
    def __init__(self, projects_repository: ProjectsRepository):
        self.projects_repository = projects_repository

    def place_project(self, items, user_id):
        return self.projects_repository.add(items, user_id)

    def get_project(self, project_id, **filters):
        project = self.projects_repository.get(project_id, **filters)
        if project is not None:
            return project
        raise ProjectNotFoundError(f"Project with id {project_id} not found")

    def update_project(self, project_id, user_id, **payload):
        project = self.projects_repository.get(project_id, user_id=user_id)
        if project is None:
            raise ProjectNotFoundError(f"Project with id {project_id} not found")
        return self.projects_repository.update(project_id, **payload)

    def list_projects(self, **filters):
        limit = filters.pop("limit", None)
        return self.projects_repository.list(limit=limit, **filters)

    def delete_project(self, project_id, user_id):
        project = self.projects_repository.get(project_id, user_id=user_id)
        if project is None:
            raise ProjectNotFoundError(f"Project with id {project_id} not found")
        return self.projects_repository.delete(project_id)
