import { format } from "date-fns";
import { ProjectList } from "../projectlist";
import { Project } from "../project";
import { TodoItem } from "../item";
import modalCloseIcon from "../../media/close.svg";
import { createElement, formatDateForUser, priorities } from "../../index";
import { refreshProjectToDisplay } from "./content";
import { refreshProjects } from "./sidebar";

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
const formatDateWithTimezone = function(dueDate) {
    let dt = new Date(dueDate.value);
    let dtDate = new Date(dt.valueOf() + dt.getTimezoneOffset() * 60 * 1000);
    let dueDateFormatted = format(dtDate, "yyyy-MM-dd");
    return dueDateFormatted;
}

const convertPriorityEnumToWord = function(priorityEnum) {
    switch (priorityEnum) {
        case (priorities.low):
            return "Low";
        case (priorities.medium):
            return "Medium";
        case (priorities.high):
            return "High";
    }
}

const getPriorityEnumVal = function(priorityVal) {
    switch (priorityVal) {
        case("Low"):
            return priorities.low;
        case("Medium"):
            return priorities.medium;
        case("High"):
            return priorities.high;
    }
}

const handleAddTaskSubmit = function(project) {
    let title = document.querySelector("#task-title");
    let description = document.querySelector("#task-description");
    let dueDate = document.querySelector("#task-due-date");
    let dueDateFormatted = formatDateWithTimezone(dueDate);
    
    let priority = document.querySelector(`input[name="task-priority"]:checked`);
    let priorityVal = getPriorityEnumVal(priority.value);
    let newItem = new TodoItem(title.value, description.value, dueDateFormatted, priorityVal);
    project.addItem(newItem);
}

const handleEditTaskSubmit = function(task, project) {
    let title = document.querySelector("#task-title");
    let description = document.querySelector("#task-description");
    let dueDate = document.querySelector("#task-due-date");
    let dueDateFormatted = formatDateWithTimezone(dueDate);
    let priority = document.querySelector(`input[name="task-priority"]:checked`);
    let priorityVal = getPriorityEnumVal(priority.value);

    let editedItem = new TodoItem(title.value, description.value, dueDateFormatted, priorityVal);
    project.editItem(task.id, editedItem);
}

const handleAddProjectSubmit = function(projectList) {
    let projectName = document.querySelector("#project-name");
    let newProject = new Project(projectName.value);
    projectList.addProject(newProject);
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

const createAddProjectForm = function(projectList) {
    const addProjectForm = createElement("form", ["add-project-form"], null, null);
    addProjectForm.appendChild(createInputElement("project-name", "text", "Name", true));

    const submitBtn = createElement("button", ["submit-btn"], "project-submit-btn", "Add Project");
    submitBtn.type = "submit";
    addProjectForm.appendChild(submitBtn);
    addProjectForm.addEventListener("submit", (e) => {
        e.preventDefault();
        handleAddProjectSubmit(projectList);
        closeFormAndModal(addProjectForm);
        refreshProjects(projectList);
    });

    return addProjectForm;
}

const createDetailsContent = function(task, project, modal) {
    const detailsDiv = createElement("div", ["details-content-container"], null, null);

    const titleRow = createElement("div", ["details-content-row"], null, null);
    const titleLabel = createElement("div", ["details-label"], null, "Title:");
    const titleContent = createElement("div", ["details-content"], null, task.title);
    titleRow.appendChild(titleLabel);
    titleRow.appendChild(titleContent);

    const descriptionRow = createElement("div", ["details-content-row"], null, null);
    const descriptionLabel = createElement("div", ["details-label"], null, "Description:");
    const descriptionContent = createElement("div", ["details-content"], null, task.description);
    descriptionRow.appendChild(descriptionLabel);
    descriptionRow.appendChild(descriptionContent);

    const dueDateRow = createElement("div", ["details-content-row"], null, null);
    const dueDateLabel = createElement("div", ["details-label"], null, "Due Date:");
    const dueDateContent = createElement("div", ["details-content"], null, formatDateForUser(task.dueDate));
    dueDateRow.appendChild(dueDateLabel);
    dueDateRow.appendChild(dueDateContent);

    const priorityRow = createElement("div", ["details-content-row"], null, null);
    const priorityLabel = createElement("div", ["details-label"], null, "Priority:");
    const priorityContent = createElement("div", ["details-content"], null, convertPriorityEnumToWord(task.priority));
    if (task.priority == priorities.low) priorityContent.classList.add("details-priority-low");
    else if (task.priority == priorities.medium) priorityContent.classList.add("details-priority-medium");
    else if (task.priority == priorities.high) priorityContent.classList.add("details-priority-high");
    priorityRow.appendChild(priorityLabel);
    priorityRow.appendChild(priorityContent);

    const projectRow = createElement("div", ["details-content-row"], null, null);
    const projectLabel = createElement("div", ["details-label"], null, "Project:");
    const projectContent = createElement("div", ["details-content"], null, project.name);
    projectRow.appendChild(projectLabel);
    projectRow.appendChild(projectContent);

    const closeBtn = createElement("button", ["details-close-btn"], null, "Close");
    closeBtn.addEventListener('click', () => { closeFormAndModal(modal )});

    detailsDiv.appendChild(titleRow);
    detailsDiv.appendChild(descriptionRow);
    detailsDiv.appendChild(dueDateRow);
    detailsDiv.appendChild(priorityRow);
    detailsDiv.appendChild(projectRow);
    detailsDiv.appendChild(closeBtn);

    return detailsDiv;
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

const renderAddProjectModal = function(projectList) {
    resetModal();
    const addProjectModal = createElement("div", ["add-project-modal"], null, null);
    const addProjectHeader = createElement("div", ["add-project-header"], null, "Add Project");

    const modalCloseBtn = createElement("button", null, null, null);
    modalCloseBtn.innerHTML = modalCloseIcon;
    modalCloseBtn.addEventListener('click', () => closeFormAndModal(addProjectModal) );
    addProjectHeader.appendChild(modalCloseBtn);

    addProjectModal.appendChild(addProjectHeader);

    const addProjectForm = createAddProjectForm(projectList);
    addProjectModal.appendChild(addProjectForm);

    modalContainer.appendChild(addProjectModal);
    renderModal();
}

const renderDetailsModal = function(task, project) {
    resetModal();
    const detailsModal = createElement("div", ["details-modal"], null, null);
    const detailsHeader = createElement("div", ["details-header"], null, "Details");

    const modalCloseBtn = createElement("button", null, null, null);
    modalCloseBtn.innerHTML = modalCloseIcon;
    modalCloseBtn.addEventListener('click', () => closeFormAndModal(detailsModal) );
    detailsHeader.appendChild(modalCloseBtn);

    detailsModal.appendChild(detailsHeader);

    const detailsContent = createDetailsContent(task, project, detailsModal);
    detailsModal.appendChild(detailsContent);

    modalContainer.appendChild(detailsModal);
    renderModal();
}

const Modal = function() {
    return modalContainer;
}

export { Modal, renderAddTaskModal, renderEditTaskModal, renderDetailsModal, renderAddProjectModal }