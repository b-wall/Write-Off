import Dropzone from "./Dropzone.js";
import TimelineAPI from "./TimelineAPI.js";

export default class Column {
    constructor(id, title) {
        const upperDropzone = Dropzone.createDropzone();
        const slug = document.querySelector('.timeline-title').dataset.slug

        this.elements = {};
        this.elements.root = Column.createRoot();
        this.elements.title = this.elements.root.querySelector('.column-title');
        this.elements.items = this.elements.root.querySelector('.column-items');
        this.elements.addItem = this.elements.root.querySelector('.add-item');

        this.elements.root.dataset.columnId = id;
        this.elements.title.textContent = title;
        this.elements.addItem.dataset.id = id;
        this.elements.items.appendChild(upperDropzone);

        TimelineAPI.getTimelineItems(slug, id)
    }

    static createRoot() {
        const range = document.createRange();

        range.selectNode(document.body);

        return range.createContextualFragment(`
        <div class="column">
            <div class="column-title"></div>
            <div class="column-items"></div>
            <button class="add-item" type="button">+ Add</button>
        </div>
        `).children[0];
    }
}