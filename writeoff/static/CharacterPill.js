import TimelineAPI from "./TimelineAPI.js";

export default class CharacterPill {
    constructor(id, name) {
        const slug = document.querySelector('.timeline-title').dataset.slug;

        this.elements = {};
        this.elements.root = CharacterPill.createRoot();
        this.elements.root.dataset.id = id;
        this.elements.root.textContent = name;

        this.elements.selectedRoot = CharacterPill.createSelectedRoot();
        this.elements.selectedRoot.btn = this.elements.selectedRoot.querySelector('.character-pill-selected');
        this.elements.selectedRoot.dataset.id = id;
        this.elements.selectedRoot.btn.textContent = name;
        this.elements.selectedRoot.removeBtn = this.elements.selectedRoot.querySelector('.character-pill-selected-remove');

        this.elements.root.addEventListener('click', (e) => {
            e.preventDefault();
            const timelineId = document.querySelector('#timeline-title').dataset.tid;
            const characterContainerLower = document.querySelector('#character-scroll-selected');
            TimelineAPI.handleCharacterSelected(slug, id, timelineId, false);
            this.elements.root.parentElement.removeChild(this.elements.root);
            characterContainerLower.appendChild(this.elements.selectedRoot);
        });

        this.elements.selectedRoot.btn.addEventListener('click', (e) => {
            e.preventDefault();
        });

        this.elements.selectedRoot.removeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const timelineId = document.querySelector('#timeline-title').dataset.tid;
            const characterContainerUpper = document.querySelector('#character-scroll-select');
            TimelineAPI.handleCharacterSelected(slug, id, timelineId, true);
            this.elements.selectedRoot.parentElement.removeChild(this.elements.selectedRoot);
            characterContainerUpper.appendChild(this.elements.root);
        });
    }

    static createRoot() {
        const range = document.createRange();

        range.selectNode(document.body);

        return range.createContextualFragment(`
            <button class="character-pill"></button>
        `).children[0];
    }

    static createSelectedRoot() {
        const range = document.createRange();

        range.selectNode(document.body);

        return range.createContextualFragment(`
            <div class="character-selected-btn-container"><button class="character-pill-selected"></button><button class="character-pill-selected-remove"><svg xmlns="http://www.w3.org/2000/svg" height="20" width="20"><path d="m10 11.604-3.833 3.834q-.334.333-.792.322-.458-.01-.792-.343-.333-.334-.333-.802 0-.469.333-.803L8.396 10 4.562 6.167q-.333-.334-.322-.802.01-.469.343-.803.334-.333.802-.333.469 0 .803.333L10 8.396l3.833-3.834q.334-.333.802-.333.469 0 .803.333.333.334.333.803 0 .468-.333.802L11.604 10l3.834 3.833q.333.334.333.792t-.333.792q-.334.333-.803.333-.468 0-.802-.333Z"/></svg></button></div>
        `).children[0];
    }
}