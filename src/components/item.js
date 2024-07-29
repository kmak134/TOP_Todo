class TodoItem {
    constructor(
        title = "",
        description = "",
        dueDate = new Date(),
        priority = priorities.low
    ) {
        this._title = title,
        this._description = description,
        this._dueDate = dueDate, 
        this._priority = priority,
        this._isComplete = false,
        this._id = "item" + Math.random().toString(16).slice(2)
    }

    get title() {
        return this._title;
    }

    set title(title) {
        this._title = title;
    }

    get description() {
        return this._description;
    }

    set description(description) {
        this._description = description;
    }

    get dueDate() {
        return this._dueDate;
    }

    set dueDate(date) {
        this._dueDate = date;
    }

    get priority() {
        return this._priority;
    }

    set priority(priority) {
        this._priority = priority;
    }

    get isComplete() {
        return this._isComplete;
    }

    set isComplete(isComplete) {
        this._isComplete = isComplete;
    }

    get id() {
        return this._id;
    }
}

export { TodoItem }