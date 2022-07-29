import CharacterPill from "./CharacterPill.js";
import getCookie from "./cookie.js";
import Item from "./Item.js";


const csrftoken = getCookie('csrftoken');
const characterContainerUpper = document.querySelector('#character-scroll-select');
const characterContainerLower = document.querySelector('#character-scroll-selected');

export default class TimelineAPI {
    static getTimelineItems(slug, cid) {   
        fetch(`/api/project/timeline/${slug}/${cid}/`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': csrftoken
            }
        })
            .then(response => response.json())
            .then(items => {
                items.forEach(item => {
                    this.renderItem(item, item.columnId);
                })
            })
            .catch((err) => {
                console.log(err);
            })
    };

    static getTimelineItem(slug, id) {
        fetch(`/api/project/timeline/${slug}/item/${id}/`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': csrftoken
            }
        })
            .then(response => response.json())
            .catch(err => console.log(err))
    }

    static createItem(slug, cid) {
    fetch(`/api/project/timeline/${slug}/create/`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify({
            title: '',
            columnId: cid,
            position: true
        })
    })
        .then(response => response.json())
        .then(item => this.renderItem(item, item.columnId))
        .catch (err => console.log(err))
    };

    static updateItem(slug, id, title) {
        fetch(`/api/project/timeline/${slug}/edit/${id}/`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({
                title: title,
                position: false
            })
        })
    };

    static deleteItem(slug, id) {
        fetch(`/api/project/timeline/${slug}/delete/${id}/`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': csrftoken
            }
        })
    };

    static moveItem(slug, id, cid, title) {
        const items = this.createIndex(cid)
            
        fetch(`/api/project/timeline/${slug}/edit/${id}/`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({
                title: title,
                position: true,
                columnId: cid,
                items: items
            })
        });
    };

    static getTimelineEditData(slug, id) {
        fetch(`/api/project/timeline/characters/${slug}/${id}/`, {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                        'X-CSRFToken': csrftoken
                    }
                })
            .then(response => response.json())
            .then(characterContainerUpper.innerHTML = '')
            .then(characterContainerLower.innerHTML = '')
            .then(item => {
                // Set Values for input boxes
                const title = document.querySelector('#timeline-title');
                const content = document.querySelector('#timeline-content');
                const time = document.querySelector('#timeline-time');
                const checkmark = document.querySelector('#timeline-completed-input');
                
                title.value = item.data[2][0].title;
                title.dataset.tid = item.data[2][0].id;
                content.value = item.data[2][0].content;
                time.value = item.data[2][0].time;
                item.data[2][0].completed ? checkmark.checked = true : checkmark.checked = false;                

                // Load in character pills and seperate according to selected/not selected to appear in the event
                item.data[0].forEach(character => {
                    this.renderSelectPill(character, characterContainerUpper);
                });

                item.data[1].forEach(character => {
                    this.renderSelectedPill(character, characterContainerLower);
                });
            })     
        .catch(err => console.log(err))
    }

    static handleCharacterSelected(slug, id, tid, deleted) {
        fetch(`/api/project/timeline/${slug}/edit/characters/${id}/`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({
                id: id,
                timelineId: tid,
                deleted: deleted,
            })
        })
    }        

    static updateTimelineDetailed(slug, id) {
        const title = document.querySelector('#timeline-title').value;
        const content = document.querySelector('#timeline-content').value;
        const timeValue = document.querySelector('#timeline-time').value;
        const checkBtn = document.querySelector('#timeline-completed-input');
        let completed;
        checkBtn.checked ? completed = true : completed = false;
        fetch(`/api/project/timeline/${slug}/edit/detailed/${id}/`, {
                    method: 'PUT',
                    headers: {
                        'Content-type': 'application/json',
                        'X-CSRFToken': csrftoken
                    },
                    body: JSON.stringify({
                    title: title,
                    content: content,
                    time: timeValue,
                    completed: completed,
                })
            }).then(response => response.json()).catch(err => console.log(err))
    }

    static createIndex(cid) {
        const items = Array.from(document.querySelector(`[data-column-id="${cid}"]`).querySelector('.column-items').querySelectorAll('.droppable-item'));
        let indexNo = [];
        for (let item of items) {
            indexNo.push(item.dataset.id);
        }
        let sortedItems = indexNo.join(',');
        return sortedItems;
    }

    static renderItem(data, columnId) {
        const item = new Item(data.id, data.title);
        document.querySelector(`[data-column-id="${columnId}"]`).querySelector('.column-items').appendChild(item.elements.root)
    };

    static renderSelectPill(data, element) {
        const pill = new CharacterPill(data.id, data.name);
        element.appendChild(pill.elements.root);
    };

    static renderSelectedPill(data, element) {
        const pill = new CharacterPill(data.id, data.name);
        element.appendChild(pill.elements.selectedRoot);
    };
}