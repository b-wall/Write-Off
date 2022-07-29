import Modal from "./Modal.js";
import Timeline from "./Timeline.js";
import TimelineAPI from "./TimelineAPI.js";


// Timeline Columns

new Timeline(
    document.querySelector('.column-container')
)

const slug = document.querySelector('.timeline-title').dataset.slug

document.querySelectorAll('.add-item').forEach(item => {
    item.addEventListener('click', (e) => {
        var cid = e.target.dataset.id
        TimelineAPI.createItem(slug, cid)
    });
});

// Save/Cancel Edited Timeline Detailed Data

document.querySelector('#submit-timeline-update').addEventListener('click', (e) => {
    e.preventDefault();
    const tid = document.querySelector('#timeline-title').dataset.tid;
    TimelineAPI.updateTimelineDetailed(slug, tid);
    const modals = document.querySelectorAll('.timeline-modal.active');
    modals.forEach(modal => {
        Modal.closeModal(modal);
    })    
});

document.querySelector('#close-timeline-modal').addEventListener('click', (e) => {
    e.preventDefault();
    const modals = document.querySelectorAll('.timeline-modal.active');
    modals.forEach(modal => {
        Modal.closeModal(modal);
    })
});



// Popup Functionality

const overlay = document.querySelector('.overlay')

overlay.addEventListener('click', () => {
    const modals = document.querySelectorAll('.timeline-modal.active')
    modals.forEach(modal => {
        Modal.closeModal(modal);
    })
});

// Scrolling functionality

const upperScrollContainer = document.querySelector('#upper-scroll-wrapper');
const lowerScrollContainer = document.querySelector('#lower-scroll-wrapper');
const rightSelect = document.querySelector('#timeline-character-select-right');
const leftSelect = document.querySelector('#timeline-character-select-left');
const rightSelected = document.querySelector('#timeline-character-selected-right'); 
const leftSelected = document.querySelector('#timeline-character-selected-left');

// Scroll dragging

let mouseDown = false;
let startX, scrollLeft;

let startDraggingUpper = function (e) {
    mouseDown = true;
    startX = e.pageX - upperScrollContainer.offsetLeft;
    scrollLeft = upperScrollContainer.scrollLeft;
};

let stopDraggingUpper = function (e) {
    e.preventDefault();
    mouseDown = false;
    detectBounds(upperScrollContainer, 'upper');
};

let startDraggingLower = function (e) {
    mouseDown = true;
    startX = e.pageX - lowerScrollContainer.offsetLeft;
    scrollLeft = lowerScrollContainer.scrollLeft;
};


let stopDraggingLower = function (e) {
    e.preventDefault();
    mouseDown = false;
    detectBounds(lowerScrollContainer, 'lower');
};

upperScrollContainer.addEventListener('mousemove', (e) => {
    e.preventDefault();
    if (!mouseDown) { return; }
    const x = e.pageX - upperScrollContainer.offsetLeft;
    const scroll = x - startX;
    upperScrollContainer.scrollLeft = scrollLeft - scroll;
});

lowerScrollContainer.addEventListener('mousemove', (e) => {
    e.preventDefault();
    if (!mouseDown) { return; }
    const x = e.pageX - lowerScrollContainer.offsetLeft;
    const scroll = x - startX;
    lowerScrollContainer.scrollLeft = scrollLeft - scroll;
});

upperScrollContainer.addEventListener('mousedown', startDraggingUpper, false);
upperScrollContainer.addEventListener('mouseup', stopDraggingUpper, false);
upperScrollContainer.addEventListener('mouseleave', stopDraggingUpper, false);

lowerScrollContainer.addEventListener('mousedown', startDraggingLower, false);
lowerScrollContainer.addEventListener('mouseup', stopDraggingLower, false);
lowerScrollContainer.addEventListener('mouseleave', stopDraggingLower, false);

// Click to scroll

rightSelect.onclick = function (e) {
    e.preventDefault();
    scrollX(upperScrollContainer, 'right', 20, 120, 30).then(() => detectBounds(upperScrollContainer, 'upper'));
};

leftSelect.onclick = function (e) {
    e.preventDefault();
    scrollX(upperScrollContainer, 'left', 20, 120, 30).then(() => detectBounds(upperScrollContainer, 'upper'));
};

rightSelected.onclick = function (e) {
    e.preventDefault();
    scrollX(lowerScrollContainer, 'right', 20, 120, 30).then(() => detectBounds(lowerScrollContainer, 'lower'));
};

leftSelected.onclick = function (e) {
    e.preventDefault();
    scrollX(lowerScrollContainer, 'left', 20, 120, 30).then(() => detectBounds(lowerScrollContainer, 'lower'));
};


// Scroll Utility Functions

function scrollX(element, direction, speed, distance, step) {
    return new Promise((resolve, reject) => {
    let stepCounter = 0;
    const timer = setInterval(function () {
        if (direction == 'right') {
            element.scrollLeft += step;
        }
        else {
            element.scrollLeft -= step;
        }
        stepCounter += step;
        if (stepCounter >= distance) {
            window.clearInterval(timer);
            resolve('Success');
        }
    }, speed);
    })
};

function detectBounds(element, location) {
    if (Math.ceil((element.scrollLeft + element.offsetWidth)) >= element.scrollWidth) {
        element.classList.add(`at-end-${location}`)
    }
    else {
        element.classList.remove(`at-end-${location}`)
    }
    if (element.scrollLeft == 0) {
        element.classList.add(`at-start-${location}`)
    }
    else {
        element.classList.remove(`at-start-${location}`)
    }
}

