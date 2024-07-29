import { Project } from "../project";
import { TodoItem } from "../item";
import { createElement } from "../../index";

const content = createElement("div", [], "content", null);
const contentHeader = createElement("div", ["content-header"], null, null);
const tasksDiv = createElement("div", ["tasks-div"], null, null);

const clearContent = function() {
    content.innerHTML = "";
    contentHeader.innerHTML = "";
    tasksDiv.innerHTML = "";
}

const buildHeader = function(title) {
    let currTitle = createElement("h1", ["content-curr-title"], null, title);
    contentHeader.appendChild(currTitle);
    content.appendChild(contentHeader);
}

const createTaskElement = function(title, description, dueDate, priority) {
    let item  = createElement("p", null, null, `Title is ${title} with ${description} with due date ${dueDate} and priority ${priority}`);
    return item;
}

const buildTasks = function(projectTasks) {
    let taskHeader = createElement("div", ["tasks-header"], null, `Tasks (${projectTasks.length})`);
    tasksDiv.appendChild(taskHeader);

    let taskList = createElement("div", ["task-list"], null, null);
    for (let task of projectTasks) {
        let taskElement = createTaskElement(task.title, task.description, task.dueDate, task.priority);
        taskList.appendChild(taskElement);
    }

    tasksDiv.append(taskList);
    content.append(tasksDiv);
}

const changeProjectToDisplay = function(project) {
    clearContent();
    buildHeader(project.name);
    buildTasks(project.items);
}

const initializeContent = function() {
    clearContent();
    buildHeader();
    buildTasks([]);
}

const Content = function() {
    initializeContent();
    return content;
}

export { Content, changeProjectToDisplay }
    