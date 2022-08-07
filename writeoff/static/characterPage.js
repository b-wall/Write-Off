// Expandable New Character Form
const addProject = document.querySelector('.add-project');
const cards = document.querySelector('.character-card')
const cardHeader = document.querySelectorAll('.character-card-header');
const formAction = document.querySelector('.character-add-form').action;

const nameInput = document.querySelector('#id_name');
const ageInput = document.querySelector('#id_age');
const personalityInput = document.querySelector('#id_personality');
const appearanceInput = document.querySelector('#id_appearance');
const otherInput = document.querySelector('#id_other');

// Calculate height of expand button placement

cardHeader.forEach(header => {
    header.parentElement.style.maxHeight = header.clientHeight + header.nextElementSibling.clientHeight + 'px';
})

addProject.addEventListener('click', () => {
    const allAffiliations = document.querySelector('#id_affiliations').querySelectorAll('input[name="affiliations"]');

    // Clear out old values
    nameInput.value = '';
    ageInput.value = '';
    personalityInput.value = '';
    appearanceInput.value = '';
    otherInput.value = '';

    allAffiliations.forEach(affiliation => {
        affiliation.checked = false;
    });

    // Change submit button text
    document.querySelector('.add-character-btn').textContent = '+ CHARACTER';

    // Revert form url
    document.querySelector('.character-add-form').action = formAction;

    const projectForm = document.querySelector('.character-form-container');
    addProject.classList.toggle('active');
    projectForm.classList.toggle('active');

});

// Character page expand on click

document.querySelectorAll('.character-expand-button').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        button.classList.toggle('active');

        if (button.classList.contains('active')) {
            button.closest('.character-card').style.maxHeight = button.closest('.character-card').scrollHeight + 'px';
            button.style.transform = 'rotate(180deg)';
        }

        else {
            button.closest('.character-card').style.maxHeight = button.clientHeight + button.previousElementSibling.clientHeight + 'px';
            button.style.transform = 'rotate(0deg)';
        }
    });
});

// Populate form for edit

const editBtns = document.querySelectorAll('.edit-character-btn');

editBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Expand edit form
        const projectForm = document.querySelector('.character-form-container');
        addProject.classList.add('active');
        projectForm.classList.add('active');
        document.body.scrollTop = document.documentElement.scrollTop = 0;

        // Populate fields
        let affiliationsList = []

        const name = btn.parentElement.parentElement.querySelector('h2').textContent;
        const age = btn.closest('.character-card').querySelector('#character-age').textContent;
        const personality = btn.closest('.character-card').querySelector('#character-personality').textContent;
        const appearance = btn.closest('.character-card').querySelector('#character-appearance').textContent;
        const other = btn.closest('.character-card').querySelector('#character-other').textContent;
        const affiliations = btn.closest('.character-card').querySelectorAll('.character-pill.affiliations');
        const allAffiliations = document.querySelector('#id_affiliations').querySelectorAll('input[name="affiliations"]');
        const characterId = btn.closest('.character-card').dataset.characterId;
        
        // Clear out old values

        nameInput.value = '';
        ageInput.value = '';
        personalityInput.value = '';
        appearanceInput.value = '';
        otherInput.value = '';
 
        // Add in current values

        nameInput.value = name;
        age ? ageInput.value : null;
        personalityInput.value = personality;
        appearanceInput.value = appearance;
        otherInput.value = other;

        affiliations.forEach(affiliation => {
            affiliationsList.push(affiliation.dataset.id);
        })

        allAffiliations.forEach(affiliation => {
            affiliation.checked = false;
            if (affiliationsList.includes(affiliation.value)) {
                affiliation.checked = true;
            }
        });

        // Redirect Form url

        document.querySelector('.character-add-form').action = formAction;
        console.log(`resetting to ${document.querySelector('.character-add-form').action}`)
        document.querySelector('.character-add-form').action += `edit/${characterId}/`;
        console.log(`new value is ${document.querySelector('.character-add-form').action}`)

        // Change submit button text

        document.querySelector('.add-character-btn').textContent = 'EDIT CHARACTER';
        
    });
});

// Confirm Character Delete

document.querySelectorAll('.delete-character-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        result = confirm("Are you sure you want to delete this character?");
        if (!result) {
            e.preventDefault();
            return
        }
    });
});