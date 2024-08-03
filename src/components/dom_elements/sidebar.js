import { Project } from "../project";
import { ProjectList } from "../projectlist";
import { createElement } from "../../index";
import { refreshProjectToDisplay, displayProjectTasks } from "./content";
import { renderAddProjectModal } from "./modal";
import addIcon from "../../media/add.svg";


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
    let projectBtn = createElement("button", ["sidebar-btn"], project.id, project.name);
    projectBtn.addEventListener('click', () => refreshProjectToDisplay(project));
    return projectBtn;
}

const addProjectsToSidebar = function(projectList) {
    let projectsDiv = createElement("div", ["sidebar-project-div"], null, null);
    let projectsHeader = createElement("div", ["sidebar-projects-header"], null, "Projects");

    let addProjectBtn = createElement("button", ["add-project-btn"], null, null);
    addProjectBtn.innerHTML = addIcon;
    addProjectBtn.addEventListener("click", () => { renderAddProjectModal(projectList) });
    projectsHeader.appendChild(addProjectBtn);
    projectsDiv.appendChild(projectsHeader);

    for (let project of projectList.projects) {
        let projectElement = createProjectElement(project);
        projectsDiv.appendChild(projectElement);
    }
    sidebar.appendChild(projectsDiv);
}

const refreshSidebar = function(projectList) {
    sidebar.innerHTML = "";
    initializeSidebar();
    addProjectsToSidebar(projectList);
}

const Sidebar = function(projectList) {
    initializeSidebar();
    addProjectsToSidebar(projectList);
    return sidebar;
}

export { Sidebar, refreshSidebar as refreshProjects }
    

