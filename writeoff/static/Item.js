import TimelineAPI from "./TimelineAPI.js";
import Dropzone from "./Dropzone.js";
import Modal from "./Modal.js";

export default class Item {
    constructor(id, title) {
        const lowerDropzone = Dropzone.createDropzone();
        const modal = document.querySelector('.timeline-modal');

        this.elements = {};
        this.elements.root = Item.createRoot();
        this.elements.input = this.elements.root.querySelector('.timeline-input');
        this.elements.editBtn = this.elements.root.querySelector('.edit-timeline');
        
        this.elements.root.dataset.id = id;
        this.elements.input.textContent = title;
        this.title = title;
        this.slug = document.querySelector('.timeline-title').dataset.slug
        this.elements.root.appendChild(lowerDropzone);

        this.elements.editBtn.addEventListener('click', () => {
            TimelineAPI.getTimelineEditData(this.slug, id);
            Modal.openModal(modal);
        });

        const onBlur = () => {
            const newTitle = this.elements.input.textContent.trim();

            if (newTitle == this.title) {
                return;
            }

            this.title = newTitle;

            TimelineAPI.updateItem(this.slug, id, this.title)
        };

        this.elements.input.addEventListener('blur', onBlur);
        this.elements.input.addEventListener('keyup', e => {
            const key = e.key;
            if (key === "Escape") {
                this.elements.input.blur();
            }
        });

        this.elements.root.addEventListener('dblclick', () => {
            const check = confirm('Are you sure you want to delete?')
            if (check) {
                TimelineAPI.deleteItem(this.slug, id)   
                this.elements.input.removeEventListener('blur', onBlur);
                this.elements.root.parentElement.removeChild(this.elements.root);
            }
        });

        this.elements.root.addEventListener('dragstart', e => {
            e.dataTransfer.setData('text/plain', id);
        });

        this.elements.input.addEventListener('drop', e => {
            e.preventDefault();
        });
    }

    static createRoot() {
        const range = document.createRange();

        range.selectNode(document.body);

        return range.createContextualFragment(`
            <div draggable="true" class="droppable-item">
                <div class="timeline-contents">
                    <div contenteditable class="timeline-input"></div>
                    <button class="edit-timeline"><svg xmlns="http://www.w3.org/2000/svg" height="24" width="24"><path d="m16 8.4-8.875 8.9q-.3.3-.713.3-.412 0-.712-.3t-.3-.713q0-.412.3-.712L14.6 7H7q-.425 0-.713-.287Q6 6.425 6 6t.287-.713Q6.575 5 7 5h10q.425 0 .712.287Q18 5.575 18 6v10q0 .425-.288.712Q17.425 17 17 17t-.712-.288Q16 16.425 16 16Z"/></svg></button>
                </div>
            </div>
        `).children[0];
    }
}