class ProjectList {
    constructor(
        projects = []
    ) {
        this._projects = projects;
    }

    addProject(project) {
        this._projects.push(project);
    }

    removeProject(projectId) {
        this._projects = this._projects.filter(project => project._id !== projectId);
    }

    findProject(projectName) {
        return this._projects.find(project => project._name == projectName);
    }

    findProjectById(projectId) {
        return this._projects.find(project => project._id == projectId);
    }

    get projects() {
        return this._projects;
    }
}

export { ProjectList }