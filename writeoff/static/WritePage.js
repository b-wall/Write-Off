import getCookie from "./cookie.js";
const csrftoken = getCookie('csrftoken');

document.querySelector('#scroll-top-btn').addEventListener('click', (e) => {
    e.preventDefault();
    const textBox = document.querySelector('#book-content')
    textBox.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
    });
});
document.querySelector('#scroll-bottom-btn').addEventListener('click', (e) => {
    e.preventDefault();
    const textBox = document.querySelector('#book-content')
    textBox.scrollTo({
        top: textBox.scrollHeight,
        left: 0,
        behavior: "smooth"
    });
});

// Fetch and display current book content
const slug = document.querySelector('.write-title').dataset.slug;

getBookContent(slug);

// Save changes to current content

const saveBtn = document.querySelector('#save-btn');

saveBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const content = document.querySelector('#book-content').value;
    editBookContent(slug, content);
    saveBtn.textContent = 'SAVED!';
    setTimeout(() => {
        saveBtn.textContent = 'SAVE';
    }, 3000);
});

// API Calls

function getBookContent(slug) {   
    fetch(`/api/project/write/${slug}/book/`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            'X-CSRFToken': csrftoken
        }
    })
        .then(response => response.json())
        .then(book => {
            document.querySelector('#book-content').textContent = book.content;
        })
        .catch((err) => {
            console.log(err);
        })
};

function editBookContent(slug, content) {
    fetch(`/api/project/write/${slug}/book/edit/`, {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json',
            'X-CSRFToken': csrftoken
        },
        body: JSON.stringify({
            content: content
        })
    })
        .then(response => response.json())
        .catch(err => console.log(err))
}