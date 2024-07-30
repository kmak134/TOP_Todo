import { Project } from "../project";
import { ProjectList } from "../projectlist";
import { createElement } from "../../index";
import { changeProjectToDisplay, displayProjectTasks } from "./content";

const sidebar = createElement("div", [], "sidebar", null);

const initializeSidebar = function() {
    const homeBtn = createElement("button", ["sidebar-btn"], "home-btn", "Home");
    const todayBtn = createElement("button", ["sidebar-btn"], "today-btn", "Today");
    const weekBtn = createElement("button", ["sidebar-btn"], "week-btn", "This Week");

    sidebar.appendChild(homeBtn);
    sidebar.appendChild(todayBtn);
    sidebar.appendChild(weekBtn);
}

const createProjectElement = function(project) {
    let projectBtn = createElement("button", ["sidebar-project-btn"], project.id, project.name);
    projectBtn.addEventListener('click', () => changeProjectToDisplay(project));
    return projectBtn;
}


const addProjectsToSidebar = function(projects) {
    let projectsDiv = createElement("div", ["sidebar-project-div"], null, null);
    let projectsHeader = createElement("p", ["sidebar-projects-header"], null, "Projects");
    projectsDiv.appendChild(projectsHeader);
    for (let project of projects) {
        let projectElement = createProjectElement(project);
        projectsDiv.appendChild(projectElement);
    }
    sidebar.appendChild(projectsDiv);
}

const Sidebar = function(projects) {

    initializeSidebar();
    addProjectsToSidebar(projects);
    return sidebar;
}

export default Sidebar
    

