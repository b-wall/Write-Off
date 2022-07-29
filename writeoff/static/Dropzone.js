import TimelineAPI from "./TimelineAPI.js";

export default class Dropzone {
    static createDropzone() {
        const range = document.createRange();

        range.selectNode(document.body);

        const dropzone = range.createContextualFragment(`
           <div class="dropzone"></div>
        `).children[0];

        dropzone.addEventListener('dragover', e => {
            e.preventDefault();
            dropzone.classList.add('active');
        });

        dropzone.addEventListener('dragleave', () => {
            dropzone.classList.remove('active');
        });

        dropzone.addEventListener('drop', e => {
            e.preventDefault();
            dropzone.classList.remove('active');

            const column = dropzone.closest('.column') 
            const columnId = Number(column.dataset.columnId);
            const dropzones = Array.from(column.querySelectorAll('.dropzone'));
            const index = dropzones.indexOf(dropzone) + 1;
            const itemId = Number(e.dataTransfer.getData('text/plain'));
            const item = document.querySelector(`[data-id="${itemId}"]`);
            const slug = document.querySelector('.timeline-title').dataset.slug
            const insertAfter = dropzone.parentElement.classList.contains('droppable-item') ? dropzone.parentElement : dropzone;
            const title = item.firstElementChild.firstElementChild.textContent;
            if (item.contains(dropzone)) {
                return
            }

            insertAfter.after(item);

            TimelineAPI.moveItem(slug, itemId, columnId, title)

        });

        return dropzone;
    }
}