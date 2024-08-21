import { Project } from "../project";
import { ProjectList } from "../projectlist";
import { createElement, updateLocalStorage } from "../../index";
import { refreshProjectToDisplay, buildHomeContent, buildTodayContent, buildThisWeekContent, toggleContent } from "./content";
import { renderAddProjectModal } from "./modal";
import addIcon from "../../media/add.svg";
import deleteIcon from "../../media/delete.svg";


const sidebar = createElement("div", [], "sidebar", null);
const content = document.querySelector("#content");

const addResponsiveSidebar = function() {
    if (window.innerWidth <= 1000) {
        sidebar.classList.add("hide-sidebar");
    } else {
        sidebar.classList.remove("hide-sidebar");
    }
}

const toggleSidebar = function() {
    sidebar.classList.toggle("hide-sidebar");
    sidebar.classList.toggle("show-sidebar");
    toggleContent();
}

const initializeSidebar = function() {
    const homeBtn = createElement("button", ["sidebar-btn"], "home-btn", "Home");
    const todayBtn = createElement("button", ["sidebar-btn"], "today-btn", "Today");
    const weekBtn = createElement("button", ["sidebar-btn"], "week-btn", "This Week");
    homeBtn.addEventListener("click", () => { buildHomeContent() });
    todayBtn.addEventListener("click", () => { buildTodayContent() });
    weekBtn.addEventListener("click", () => { buildThisWeekContent() });

    sidebar.appendChild(homeBtn);
    sidebar.appendChild(todayBtn);
    sidebar.appendChild(weekBtn);
}

const handleProjectDeleteClick = function(projectList, project) {
    projectList.removeProject(project.id);
    refreshSidebar(projectList);
    updateLocalStorage();
}

const createProjectElement = function(projectList, project) {
    let projectElement = createElement("div", ["project-btn"], null, null);
    let projectLabel = createElement("div", ["project-label"], null, project.name);
    projectLabel.addEventListener('click', () => refreshProjectToDisplay(project));

    projectElement.appendChild(projectLabel);

    let deleteBtn = createElement("button", ["project-delete-btn", null, null]);
    deleteBtn.innerHTML = deleteIcon;
    deleteBtn.addEventListener("click", () => { handleProjectDeleteClick(projectList, project)});

    projectElement.appendChild(deleteBtn);

    return projectElement;
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
        let projectElement = createProjectElement(projectList, project);
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

export { Sidebar, refreshSidebar as refreshProjects, addResponsiveSidebar, toggleSidebar }
    

