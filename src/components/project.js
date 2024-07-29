class Project {
    constructor(name) {
        this._name = name;
        this._items = [],
        this._id = "proj" + Math.random().toString(16).slice(2)
    }

    addItem(item) {
        this.items.push(item);
    }

    removeItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
    }

    getItem(itemTitle) {
        return this.items.find(item => item._title = itemTitle);
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

    get id() {
        return this._id;
    }
}

export { Project }