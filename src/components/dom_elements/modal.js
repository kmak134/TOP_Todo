import { format } from "date-fns";
import { ProjectList } from "../projectlist";
import { Project } from "../project";
import { TodoItem } from "../item";
import modalCloseIcon from "../../media/close.svg";
import { createElement, priorities } from "../../index";
import { refreshProjectToDisplay } from "./content";

const content = createElement("div", [], "content", null);
const modalContainer = createElement("section", ["modal", "hidden"], null, null);

const resetModal = function() {
    modalContainer.innerHTML = "";
    modalContainer.classList.remove("modal-fade-out");
}

const closeFormAndModal = function(form) {
    form.classList.add("form-closed");
    modalContainer.classList.add("modal-fade-out");
    modalContainer.classList.remove("modal-fade-in");
    setTimeout(function() { modalContainer.classList.add("hidden") }, 500);
}

const renderModal = function() {
    if (modalContainer.classList.contains("hidden")) modalContainer.classList.remove("hidden");
    modalContainer.classList.add("modal-fade-in");
}

const createTextAreaInputElement = function(name, labelContent, rows, cols, isEdit = false, valToEdit = null) {
    const inputDiv = createElement("div", ["form-input"], null, null);
    const label = createElement("label", null, null, labelContent);
    label.for = name;
    const input = createElement("textarea", ["input-textarea"], name, null);
    input.name = name;
    input.rows = rows;
    input.cols = cols;
    if (isEdit && valToEdit) {
        input.value = valToEdit;
    }
    inputDiv.appendChild(label);
    inputDiv.appendChild(input);
    return inputDiv;
}

const createInputElement = function(name, type, labelContent, isRequired, isEdit = false, valToEdit = null) {
    const inputDiv = createElement("div", ["form-input"], null, null);
    const label = createElement("label", null, null, labelContent);
    label.for = name;
    const input = createElement("input", [`input-${type}`], name, null);
    input.type = type;
    input.name = name;
    if (isRequired) {
        label.appendChild(createElement("span", ["label-star"], null, "*"));
        input.setAttribute("required", "");
    }
    if (isEdit && valToEdit) {
        input.value = valToEdit;
    }
    inputDiv.appendChild(label);
    inputDiv.appendChild(input);
    return inputDiv;
}

const createPriorityInput = function(name, id, value) {
    const priorityInput = createElement("input", ["radio-btn"], id, null);
    priorityInput.type = "radio";
    priorityInput.name = name;
    priorityInput.value = value;

    return priorityInput;
}

const createPriorityLabel = function(name, label) {
    const priorityLabel = createElement("label", ["radio-btn-label"], name, label);
    priorityLabel.setAttribute("for", name);
    return priorityLabel;
}

const createPriorityButtonsInput = function(isEdit = false, valToEdit = null) {
    const inputDiv = createElement("div", ["priority-input"], null, null);
    const priorityLabel = createElement("label", ["priority-input-title"], null, "Priority:");
    const btnDiv = createElement("div", ["priority-btn-div"], null, null);

    const lowPriorityInput = createPriorityInput("task-priority", "low", "Low");
    const lowPriorityLabel = createPriorityLabel("low", "Low");
    const mediumPriorityInput = createPriorityInput("task-priority", "medium", "Medium");
    const mediumPriorityLabel = createPriorityLabel("medium", "Medium");
    const highPriorityInput = createPriorityInput("task-priority", "high", "High");
    const highPriorityLabel = createPriorityLabel("high", "High");

    if (isEdit && valToEdit) {
        switch(valToEdit) {
            case (priorities.low):
                lowPriorityInput.setAttribute("checked", true);
                break;
            case (priorities.medium):
                mediumPriorityInput.setAttribute("checked", true);
                break;
            case (priorities.high):
                highPriorityInput.setAttribute("checked", true);
                break;
        }
    }

    inputDiv.appendChild(priorityLabel);
    btnDiv.appendChild(lowPriorityInput);
    btnDiv.appendChild(lowPriorityLabel);
    btnDiv.appendChild(mediumPriorityInput);
    btnDiv.appendChild(mediumPriorityLabel);
    btnDiv.appendChild(highPriorityInput);
    btnDiv.appendChild(highPriorityLabel);
    inputDiv.appendChild(btnDiv);

    return inputDiv;
}

// method from https://stackoverflow.com/questions/48172772/time-zone-issue-involving-date-fns-format
const formatDateForTask = function(dueDate) {
    let dt = new Date(dueDate.value);
    let dtDate = new Date(dt.valueOf() + dt.getTimezoneOffset() * 60 * 1000);
    let dueDateFormatted = format(dtDate, "yyyy-MM-dd");
    return dueDateFormatted;
}

const handleAddTaskSubmit = function(project) {
    let title = document.querySelector("#task-title");
    let description = document.querySelector("#task-description");
    let dueDate = document.querySelector("#task-due-date");
    let dueDateFormatted = formatDateForTask(dueDate);
    
    let priority = document.querySelector(`input[name="task-priority"]:checked`);
    let priorityVal;
    switch (priority.value) {
        case("Low"):
            priorityVal = priorities.low;
            break;
        case("Medium"):
            priorityVal = priorities.medium;
            break;
        case("High"):
            priorityVal = priorities.high;
            break;
    }
    let newItem = new TodoItem(title.value, description.value, dueDateFormatted, priorityVal);
    project.addItem(newItem);
}

const handleEditTaskSubmit = function(task, project) {
    let title = document.querySelector("#task-title");
    let description = document.querySelector("#task-description");
    let dueDate = document.querySelector("#task-due-date");
    let dueDateFormatted = formatDateForTask(dueDate);
    let priority = document.querySelector(`input[name="task-priority"]:checked`);
    let priorityVal;
    switch (priority.value) {
        case("Low"):
            priorityVal = priorities.low;
            break;
        case("Medium"):
            priorityVal = priorities.medium;
            break;
        case("High"):
            priorityVal = priorities.high;
            break;
    }
    let editedItem = new TodoItem(title.value, description.value, dueDateFormatted, priorityVal);
    project.editItem(task.id, editedItem);
}


const createAddTaskForm = function(project) {
    const addTaskForm = createElement("form", ["add-task-form"], null, null);
    // Title
    addTaskForm.appendChild(createInputElement("task-title", "text", "Title", true));
    // Description
    addTaskForm.appendChild(createTextAreaInputElement("task-description", "Description", 4, 50));
    // Date
    addTaskForm.appendChild(createInputElement("task-due-date", "date", "Due Date", false));
    // Priority
    addTaskForm.appendChild(createPriorityButtonsInput());

    const submitBtn = createElement("button", ["submit-btn"], "task-submit-btn", "Add Task");
    submitBtn.type = "submit";
    addTaskForm.appendChild(submitBtn);
    addTaskForm.addEventListener("submit", (e) => {
        e.preventDefault();
        handleAddTaskSubmit(project);
        closeFormAndModal(addTaskForm);
        refreshProjectToDisplay(project);
    });

    return addTaskForm;
}

const createEditTaskForm = function(task, project) {
    const editTaskForm = createElement("form", ["edit-task-form"], null, null);
    // Title
    editTaskForm.appendChild(createInputElement("task-title", "text", "Title", true, true, task.title));
    // Description
    editTaskForm.appendChild(createTextAreaInputElement("task-description", "Description", 4, 50, true, task.description));
    // Date
    editTaskForm.appendChild(createInputElement("task-due-date", "date", "Due Date", false, true, task.dueDate));
    // Priority
    editTaskForm.appendChild(createPriorityButtonsInput(true, task.priority));

    const submitBtn = createElement("button", ["submit-btn"], "task-submit-btn", "Edit Task");
    submitBtn.type = "submit";
    editTaskForm.appendChild(submitBtn);
    editTaskForm.addEventListener("submit", (e) => {
        e.preventDefault();
        handleEditTaskSubmit(task, project);
        closeFormAndModal(editTaskForm);
        refreshProjectToDisplay(project);
    });

    return editTaskForm;
}

const renderAddTaskModal = function(project) {
    resetModal();
    const addTaskModal = createElement("div", ["add-task-modal"], null, null);
    const addTaskHeader = createElement("div", ["add-task-header"], null, "Add Task");

    const modalCloseBtn = createElement("button", null, null, null);
    modalCloseBtn.innerHTML = modalCloseIcon;
    modalCloseBtn.addEventListener('click', () => closeFormAndModal(addTaskModal) );
    addTaskHeader.appendChild(modalCloseBtn);

    addTaskModal.appendChild(addTaskHeader);

    const addTaskForm = createAddTaskForm(project);
    addTaskModal.appendChild(addTaskForm);

    modalContainer.appendChild(addTaskModal);
    renderModal();
}

const renderEditTaskModal = function(task, project) {
    resetModal();
    const editTaskModal = createElement("div", ["edit-task-modal"], null, null);
    const editTaskHeader = createElement("div", ["edit-task-header"], null, "Edit Task");

    const modalCloseBtn = createElement("button", null, null, null);
    modalCloseBtn.innerHTML = modalCloseIcon;
    modalCloseBtn.addEventListener('click', () => closeFormAndModal(editTaskModal) );
    editTaskHeader.appendChild(modalCloseBtn);

    editTaskModal.appendChild(editTaskHeader);

    const editTaskForm = createEditTaskForm(task, project);
    editTaskModal.appendChild(editTaskForm);

    modalContainer.appendChild(editTaskModal);
    renderModal();
}

const Modal = function() {
    return modalContainer;
}

export { Modal, renderAddTaskModal, renderEditTaskModal }