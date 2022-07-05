const addProject = document.querySelector('.add-project')
const editBtn = document.querySelectorAll('.icon-edit')
const deleteBtn = document.querySelectorAll('.icon-delete')
const closeBtn = document.querySelectorAll('.close-modal')
const overlay = document.querySelector('.overlay')

// Collapsible Form

addProject.addEventListener('click', () => {
    projectForm = document.querySelector('.project-form')
    addProject.classList.toggle('active')
    projectForm.classList.toggle('active')
});

// Modal Functionality

editBtn.forEach(btn => {
    btn.addEventListener('click', () => {
        const modal = document.querySelector('.edit-modal')
        modal.insertAdjacentHTML("beforeend", 'EDIT ME')
        openModal(modal)
    })
});

deleteBtn.forEach(btn => {
    btn.addEventListener('click', () => {
        const modal = document.querySelector('.edit-modal')
        modal.insertAdjacentHTML("beforeend", 'ARE YOU SURE YOU WISH TO DELETE ME?')
        openModal(modal)
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
