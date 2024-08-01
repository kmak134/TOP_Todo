import { ProjectList } from "../projectlist";
import { Project } from "../project";
import { TodoItem } from "../item";
import modalCloseIcon from "../../media/close.svg";
import { createElement, priorities } from "../../index";

const content = createElement("div", [], "content", null);
const modalContainer = createElement("section", ["modal"], null, null);

const clearModal = function() {
    modalContainer.innerHTML = "";
}

const createTextAreaInputElement = function(name, labelContent, rows, cols) {
    const inputDiv = createElement("div", ["form-input"], null, null);
    const label = createElement("label", null, null, labelContent);
    label.for = name;
    const input = createElement("textarea", ["input-textarea"], name, null);
    input.name = name;
    input.rows = rows;
    input.cols = cols;
    inputDiv.appendChild(label);
    inputDiv.appendChild(input);
    return inputDiv;
}

const createInputElement = function(name, type, labelContent, isRequired) {
    const inputDiv = createElement("div", ["form-input"], null, null);
    const label = createElement("label", null, null, labelContent);
    label.for = name;
    const input = createElement("input", [`input-${type}`], name, null);
    input.type = type;
    input.name = name;
    if (isRequired) {
        label.appendChild(createElement("span", ["label-star"], null, "*"));
        input.required = "";
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

const createPriorityButtonsInput = function() {
    const inputDiv = createElement("div", ["priority-input"], null, null);
    const priorityLabel = createElement("label", null, null, "Priority:");
    const btnDiv = createElement("div", ["priority-btn-div"], null, null);

    const lowPriorityInput = createPriorityInput("priority", "low", "Low");
    const lowPriorityLabel = createPriorityLabel("low", "Low");
    const mediumPriorityInput = createPriorityInput("priority", "medium", "Medium");
    const mediumPriorityLabel = createPriorityLabel("medium", "Medium");
    const highPriorityInput = createPriorityInput("priority", "high", "High");
    const highPriorityLabel = createPriorityLabel("high", "High");

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


const createAddTaskForm = function() {
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

    return addTaskForm;
}

const renderAddTaskModal = function() {
    const addTaskModal = createElement("div", ["add-task-modal"], null, null);
    const addTaskHeader = createElement("div", ["add-task-header"], null, "Add Task");

    const modalCloseBtn = createElement("button", null, null, null);
    modalCloseBtn.innerHTML = modalCloseIcon;
    addTaskHeader.appendChild(modalCloseBtn);

    addTaskModal.appendChild(addTaskHeader);

    const addTaskForm = createAddTaskForm();
    addTaskModal.appendChild(addTaskForm);

    modalContainer.appendChild(addTaskModal);
}

const Modal = function() {
    renderAddTaskModal();
    return modalContainer;
}

export { Modal, renderAddTaskModal }