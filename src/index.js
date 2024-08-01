import "./css/styles.css";
import { format } from "date-fns";
import { TodoItem } from "./components/item";
import { Project } from "./components/project";
import { ProjectList } from "./components/projectlist";
import { Content } from "./components/dom_elements/content";
import { Modal, renderAddTaskModal } from "./components/dom_elements/modal";
import Sidebar from "./components/dom_elements/sidebar";

const app = document.querySelector("#todo-container");
const sidebar = createElement("div", [], "sidebar", null);
const content = createElement("div", [], "content", null);

const projectList = new ProjectList();
const project1 = new Project("School");
const project2 = new Project("Chores");
const item1 = new TodoItem("Laundry", "Wash pants", format(new Date(2024, 7, 29), "yyyy-MM-dd"), 3);
const item2 = new TodoItem("HSR dailies",null, format(new Date(2024, 7, 28), "yyyy-MM-dd"), 1);
const item3 = new TodoItem("Homework", "Math", format(new Date(2024, 7, 28), "yyyy-MM-dd"), 2);
project1.addItem(item3);
project2.addItem(item1);
project2.addItem(item2);
projectList.addProject(project1);
projectList.addProject(project2);


const priorities = {
    high: 1,
    medium: 2,
    low: 3
}

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

function intiializeApp() {
    app.appendChild(Sidebar(projectList.projects));
    app.appendChild(Content());
    app.appendChild(Modal());
}

intiializeApp();

export { createElement, priorities }

