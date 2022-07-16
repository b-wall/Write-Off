const addProject = document.querySelector('.add-project')
const editBtn = document.querySelectorAll('#edit-project-btn')
const deleteBtn = document.querySelectorAll('#delete-project-btn')
const closeBtn = document.querySelectorAll('#close-modal')
const overlay = document.querySelector('.overlay')

// Collapsible Form

addProject.addEventListener('click', () => {
    projectForm = document.querySelector('.project-form')
    addProject.classList.toggle('active')
    projectForm.classList.toggle('active')
});

// Modal Functionality

editBtn.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault()
        const modal = document.querySelector('.edit-modal')
        const card = btn.closest('.project-card')
        const title = card.querySelector('.card-title').querySelector('h3').innerHTML
        const titleInput = document.querySelector('#project-title-input')
        titleInput.value = title
        openModal(modal)
        
        const submitBtn = document.querySelector('#submit-project-update')
        submitBtn.addEventListener('click', () => {
            var slug = card.dataset.slug
            console.log(slug)
            editProject(slug, card)
        });
    });    
});

deleteBtn.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault()
        const project = btn.closest('.project-card')
        slug = project.dataset.slug
        result = confirm("Are you sure you want to delete your project?")
        if (result) {
            deleteProject(slug)
            project.style.display = 'none'
        }
    })
});

closeBtn.forEach(btn => {
    btn.addEventListener('click', () => {
        const modal = btn.closest('.edit-modal')
        closeModal(modal)
    })
});

overlay.addEventListener('click', () => {
    const modals = document.querySelectorAll('.edit-modal.active')
    modals.forEach(modal => {
        closeModal(modal)
    })
});

function openModal(modal) {
    if (modal == null) return
    overlay.classList.add('active')
    modal.classList.add('active')
}

function closeModal(modal) {
    if (modal == null) return
    overlay.classList.remove('active')
    modal.classList.remove('active')
}

// Progress Bar animation

const progressObserver = new IntersectionObserver((obs) => {
    obs.forEach(ob => {
        percentage = ob.target.nextElementSibling.nextElementSibling.value + '%'
        if (ob.isIntersecting) {
            ob.target.classList.add('active');
            ob.target.style.width = percentage
            progressObserver.unobserve(ob.target);
        }
    })
}, {
    threshold: 0.3,
})

document.querySelectorAll('.progress-bar').forEach(el => {
    progressObserver.observe(el);
})

// CSRF Cookie

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

// API Calls

function deleteProject(slug) {
    fetch(`/api/project/delete/${slug}/`, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json',
            'X-CSRFToken': csrftoken
        }
    })
        .then(response => response.json())
        .then(data => console.log(data))
}

function editProject(slug, card) {
    const modal = document.querySelector('.edit-modal')

    const title = document.querySelector('#project-title-input').value
    const genreString = document.querySelector('#project-genre-input').value
    const genreElement = document.querySelector(`#${genreString}`)
    const genre = genreElement.dataset.genreId

    fetch(`/api/project/edit/${slug}/`, {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify({
            'title': title,
            'genre': genre
        })
    })
        .then(response => response.json())
        .then(data => card.dataset.slug = data.base.slug)
        .then(card.querySelector('.card-title').querySelector('h3').innerHTML = title)
        .then(card.querySelector('.card-bottom').querySelector('.card-content > p').innerHTML = `Genre: ${genreString}`)
        .then(closeModal(modal))
}
