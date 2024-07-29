class ProjectList {
    constructor() {
        this._projects = [];
    }

    addProject(project) {
        this._projects.push(project);
    }

    removeProject(projectId) {
        this._projects = this._projects.filter(project => project._id !== projectId);
    }

    get projects() {
        return this._projects;
    }
}

export { ProjectList }