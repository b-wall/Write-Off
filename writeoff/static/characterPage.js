// Character page expand on click

document.querySelectorAll('.character-expand-button').forEach(button => {
    button.addEventListener('click', () => {
        button.classList.toggle('active');

        if (button.classList.contains('active')) {
            button.closest('.character-card').style.maxHeight = button.closest('.character-card').scrollHeight + 'px';
            button.style.transform = 'rotate(180deg)'
        }

        else {
            button.closest('.character-card').style.maxHeight = '150px'
            button.style.transform = 'rotate(0deg)'
        }
    });
});