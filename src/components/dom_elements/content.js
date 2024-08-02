import { Project } from "../project";
import { TodoItem } from "../item";
import { createElement, priorities } from "../../index";
import editIcon from "../../media/edit.svg";
import deleteIcon from "../../media/delete.svg";
import addIcon from "../../media/add.svg";
import { renderAddTaskModal } from "./modal";

const content = createElement("div", [], "content", null);
const contentHeader = createElement("div", ["content-header"], null, null);
const tasksDiv = createElement("div", ["tasks-div"], null, null);

const clearContent = function() {
    content.innerHTML = "";
    contentHeader.innerHTML = "";
    tasksDiv.innerHTML = "";
}

const buildHeader = function(title) {
    let currTitle = createElement("div", ["content-curr-title"], null, title);
    contentHeader.appendChild(currTitle);
    content.appendChild(contentHeader);
}

const assignItemPriority = function(item, priority) {
    switch(priority) {
        case (priorities.low):
            item.classList.add("priority-low");
            break;
        case (priorities.medium):
            item.classList.add("priority-medium");
            break;
        case (priorities.high):
            item.classList.add("priority-high");
            break;
    }
}

const switchTaskCompleteStatus = function(item, task) {
    // switching to not complete
    if (task.isComplete) {
        item.classList.remove("task-complete");
    // switching to complete
    } else {
        item.classList.add("task-complete");
    }
    task.isComplete = !task.isComplete;
}

const handleTaskDeleteClick = function(project, task) {
    project.removeItem(task.id);
    refreshProjectToDisplay(project);
}

const createTaskElement = function(project, task) {
    let item  = createElement("div", ["task-item"], null, null);

    assignItemPriority(item, task.priority);

    let leftPart = createElement("div", ["item-left-part"], null, null);
    let checkbox = createElement("div", ["item-checkbox"], null, null);
    checkbox.addEventListener('click',  () => switchTaskCompleteStatus(item, task));
    let taskTitle = createElement("p", ["item-title"], null, task.title);

    leftPart.appendChild(checkbox);
    leftPart.appendChild(taskTitle);

    let rightPart = createElement("div", ["item-right-part"], null, null);
    let detailBtn = createElement("button", ["item-detail-btn"], null, "DETAILS");
    let editBtn = createElement("button", ["item-edit-btn"], null, null);
    editBtn.innerHTML = editIcon;
    let deleteBtn = createElement("button", ["item-delete-btn"], null, null);
    deleteBtn.addEventListener("click", () => handleTaskDeleteClick(project, task));
    deleteBtn.innerHTML = deleteIcon;

    rightPart.appendChild(detailBtn);
    rightPart.appendChild(editBtn);
    rightPart.appendChild(deleteBtn);

    item.appendChild(leftPart);
    item.appendChild(rightPart);

    return item;
}

const buildTasks = function(project) {
    let taskHeader = createElement("div", ["tasks-header"], null, `Tasks (${project.items.length})`);
    let addTaskBtn = createElement("button", ["add-task-btn"], null, null);
    addTaskBtn.innerHTML = addIcon;
    addTaskBtn.addEventListener('click', () => renderAddTaskModal(project) );

    taskHeader.appendChild(addTaskBtn);
    tasksDiv.appendChild(taskHeader);

    let taskList = createElement("div", ["task-list"], null, null);
    for (let task of project.items) {
        let taskElement = createTaskElement(project, task);
        taskList.appendChild(taskElement);
    }

    tasksDiv.append(taskList);
    content.append(tasksDiv);
}

const refreshProjectToDisplay = function(project) {
    clearContent();
    buildHeader(project.name);
    buildTasks(project);
}

const initializeContent = function() {
    clearContent();
    buildHeader();
    buildTasks(new Project());
}

const Content = function() {
    initializeContent();
    return content;
}

export { Content, refreshProjectToDisplay }
    