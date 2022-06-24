// Write Page: Scroll to top or bottom of document on click

document.querySelector('#scroll-top-btn').addEventListener('click', () => {
    const textBox = document.querySelector('.ql-editor')
    textBox.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
    });
});
document.querySelector('#scroll-bottom-btn').addEventListener('click', () => {
    const textBox = document.querySelector('.ql-editor')
    textBox.scrollTo({
        top: textBox.scrollHeight,
        left: 0,
        behavior: "smooth"
    });
});