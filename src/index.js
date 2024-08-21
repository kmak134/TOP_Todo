import "./css/styles.css";
import { format } from "date-fns";
import { TodoItem } from "./components/item";
import { Project } from "./components/project";
import { ProjectList } from "./components/projectlist";
import { Content } from "./components/dom_elements/content";
import { Modal } from "./components/dom_elements/modal";
import { Sidebar, addResponsiveSidebar, toggleSidebar } from "./components/dom_elements/sidebar";
import menuIcon from "./media/menu.svg";

const app = document.querySelector("#todo-container");
const header = document.querySelector("#header");

const projectList = new ProjectList();

const priorities = {
    high: 1,
    medium: 2,
    low: 3
}

window.addEventListener('resize', addResponsiveSidebar);
window.addEventListener('load', addResponsiveSidebar);


function createElement(type, classes, id, content) {
    const element = document.createElement(type);
    if (id) element.id = id;

    if (classes) {
        for (let c of classes) {
            element.classList.add(c);
        }
    }

    if (content) element.textContent = content;

    return element
}

// method from https://stackoverflow.com/questions/48172772/time-zone-issue-involving-date-fns-format
function formatDateWithTimezone(dueDate) {
    let dt = new Date(dueDate);
    let dtDate = new Date(dt.valueOf() + dt.getTimezoneOffset() * 60 * 1000);
    return dtDate;
}

function formatDateForUser(dueDate) {
    let dtDate = formatDateWithTimezone(dueDate);
    let formattedDate = format(dtDate, "MMM d, yyyy");
    return formattedDate;
}

const updateLocalStorage = function() {
    localStorage.setItem("projects", JSON.stringify(projectList.projects));
}

const retrieveProjectsFromStorage = function() {
    let projects = JSON.parse(localStorage.getItem("projects"));
    if (projects) {
        for (let project of projects) {
            console.log(project);
            let newProject = new Project(project._name, project._id);
            console.log(newProject);
            if (project._items) {
                for (let task of project._items) {
                    let newTask = new TodoItem(task._title, task._description, task._dueDate, task._priority, task._isComplete, task._id);
                    newProject.addItem(newTask);
                }
            }
            projectList.addProject(newProject);
        }
    }
}



const createHeader = function() {
    let header = createElement("div", ["header"], "header", null);
    let menuBtn = createElement("button", null, "menu-btn", null);
    menuBtn.innerHTML = menuIcon;
    menuBtn.addEventListener('click', () => {
        toggleSidebar()
    })
    let headerText = createElement("div", null, null, "Todo");
    header.appendChild(menuBtn);
    header.appendChild(headerText);
    app.appendChild(header);
}

const contentContainer = createElement("div", ["content-container"], "content-container", null);

function intiializeApp() {
    retrieveProjectsFromStorage();
    createHeader();
    contentContainer.appendChild(Sidebar(projectList));
    contentContainer.appendChild(Content());
    contentContainer.appendChild(Modal());
    app.appendChild(contentContainer);
}

intiializeApp();

export { createElement, formatDateForUser, formatDateWithTimezone, updateLocalStorage, priorities, projectList }

