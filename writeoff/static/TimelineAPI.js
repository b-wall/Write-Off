import getCookie from "./cookie.js";
import Item from "./Item.js";


const csrftoken = getCookie('csrftoken')

export default class TimelineAPI {
    static getTimelineItems(slug, cid) {   
        fetch(`/api/project/timeline/${slug}/${cid}`, {
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
            .then(item => console.log(item))
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
        })
        

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
}