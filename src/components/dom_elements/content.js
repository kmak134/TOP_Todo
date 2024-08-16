import { compareAsc, isToday, isThisWeek } from "date-fns";
import { Project } from "../project";
import { TodoItem } from "../item";
import { createElement, formatDateForUser, formatDateWithTimezone, updateLocalStorage, priorities, projectList } from "../../index";
import editIcon from "../../media/edit.svg";
import deleteIcon from "../../media/delete.svg";
import addIcon from "../../media/add.svg";
import { renderAddTaskModal, renderEditTaskModal, renderDetailsModal } from "./modal";

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
    updateLocalStorage();
}

const handleTaskDeleteClick = function(task, project) {
    project.removeItem(task.id);
    refreshProjectToDisplay(project);
    updateLocalStorage();
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
    let dueDate = createElement("div", ["item-due-date"], null, formatDateForUser(task.dueDate));
    let detailBtn = createElement("button", ["item-detail-btn"], null, "DETAILS");
    detailBtn.addEventListener("click", () => renderDetailsModal(task, project));

    let editBtn = createElement("button", ["item-edit-btn"], null, null);
    editBtn.addEventListener("click", () => renderEditTaskModal(task, project));
    editBtn.innerHTML = editIcon;

    let deleteBtn = createElement("button", ["item-delete-btn"], null, null);
    deleteBtn.addEventListener("click", () => handleTaskDeleteClick(task, project));
    deleteBtn.innerHTML = deleteIcon;

    rightPart.appendChild(dueDate);
    rightPart.appendChild(detailBtn);
    rightPart.appendChild(editBtn);
    rightPart.appendChild(deleteBtn);

    item.appendChild(leftPart);
    item.appendChild(rightPart);

    return item;
}

const buildProjectTasks = function(project) {
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

const buildHomeContent = function() {
    clearContent();
    buildHeader("Home");

    let listOfTasks = [];
    let taskListDiv = createElement("div", ["task-list"], null, null);
    for (let project of projectList.projects) {
        for (let task of project.items) {
            listOfTasks.push(task);
        }
    }

    listOfTasks.sort((x, y) => ( compareAsc(x.dueDate, y.dueDate) ));

    for (let task of listOfTasks) {
        let taskElement = createTaskElement(projectList.findProject(task.project), task);
        taskListDiv.appendChild(taskElement);
    }

    let homeHeader = createElement("div", ["tasks-header"], null, `Tasks (${listOfTasks.length})`);

    tasksDiv.appendChild(homeHeader);
    tasksDiv.append(taskListDiv);
    content.append(tasksDiv);
}

const buildTodayContent = function() {
    clearContent();
    buildHeader("Today");

    let taskListDiv = createElement("div", ["task-list"], null, null);
    let taskCount = 0;
    for (let project of projectList.projects) {
        for (let task of project.items) {
            let dtDate = formatDateWithTimezone(task.dueDate);
            if (isToday(dtDate)) {
                taskCount++;
                let taskElement = createTaskElement(project, task);
                taskListDiv.appendChild(taskElement);
            }
        }
    }

    let todayHeader = createElement("div", ["tasks-header"], null, `Tasks (${taskCount})`);

    tasksDiv.appendChild(todayHeader);
    tasksDiv.append(taskListDiv);
    content.append(tasksDiv);
}

const buildThisWeekContent = function() {
    clearContent();
    buildHeader("This Week");

    let taskListDiv = createElement("div", ["task-list"], null, null);
    let taskCount = 0;
    for (let project of projectList.projects) {
        for (let task of project.items) {
            let dtDate = formatDateWithTimezone(task.dueDate);
            if (isThisWeek(dtDate)) {
                taskCount++;
                let taskElement = createTaskElement(project, task);
                taskListDiv.appendChild(taskElement);
            }
        }
    }

    let thisWeekHeader = createElement("div", ["tasks-header"], null, `Tasks (${taskCount})`);

    tasksDiv.appendChild(thisWeekHeader);
    tasksDiv.append(taskListDiv);
    content.append(tasksDiv);
}

const refreshProjectToDisplay = function(project) {
    clearContent();
    buildHeader(project.name);
    buildProjectTasks(project);
}

const initializeContent = function() {
    buildHomeContent();
}

const Content = function() {
    initializeContent();
    return content;
}

export { Content, refreshProjectToDisplay, buildHomeContent, buildTodayContent, buildThisWeekContent }
    