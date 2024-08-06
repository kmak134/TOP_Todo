class Project {
    constructor(name) {
        this._name = name;
        this._items = [],
        this._id = "proj" + Math.random().toString(16).slice(2)
    }

    addItem(item) {
        item.project = this._name;
        this.items.push(item);
    }

    removeItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
    }

    getItem(itemTitle) {
        return this.items.find(item => item._title = itemTitle);
    }

    editItem(itemId, editedItem) {
        let taskIndex = this.items.findIndex(item => item.id == itemId);
        this.items[taskIndex] = editedItem;
    }

    get name() {
        return this._name;
    }

    set name(name) {
        this._name = name;
    }

    get items() {
        return this._items;
    }

    set items(items) {
        this._items = items;
    }

    get id() {
        return this._id;
    }
}

export { Project }