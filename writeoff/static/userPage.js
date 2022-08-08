const csrftoken = getCookie('csrftoken');
const uid = document.querySelector('#user-profile-text').dataset.id;
const genreChart = document.getElementById('genre-chart');
const timelineCompletionChart = document.getElementById('timeline-completion-chart');
const characterRelationshipChart = document.getElementById('character-relationship-chart');

getGenreData(uid);

getTimelineCompletionData(uid);

getCharacterRealtionshipData(uid);

// Fetch Data

function getGenreData(uid) {
        fetch(`/api/stats/${uid}/genres/`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': csrftoken
            }
        })
            .then(response => response.json())
            .then(data => {
                const labels = {}
                data.forEach(item => {
                    labels[item.genre.name] = (labels[item.genre.name] || 0) + 1;
                })

                // Render the chart with the data
                const newGenreChart = new Chart(genreChart, {
                    type: 'doughnut',
                    data: {
                        labels: Object.keys(labels),
                        datasets: [{
                            label: 'Project Genres',
                            data: Object.values(labels),
                            backgroundColor: [
                            'rgb(255, 99, 132)',
                            'rgb(54, 162, 235)',
                            'rgb(255, 205, 86)'
                            ],
                            hoverOffset: 4
                        }]
                        },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            })
            
            .catch(err => console.log(err))
}

function getTimelineCompletionData(uid) {
        fetch(`/api/stats/${uid}/timelines/`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': csrftoken
            }
        })
            .then(response => response.json())
            .then(data => {
                const trueCount = data.filter((item) => item.completed).length
                
                let truePercent = Math.round((trueCount / data.length) * 100)
                if (!truePercent) {
                    truePercent = 0;
                }

                falsePercent = (100 - truePercent)

                const newTimelineChart = new Chart(timelineCompletionChart, {
                    type: 'pie',
                    data: {
                        labels: ['Total Timeline Items Completed (%)', 'Total Timeline Items Not Completed (%)'],
                        datasets: [{
                            label: 'Timeline Item Completion',
                            data: [truePercent, falsePercent],
                            backgroundColor: [
                            'rgb(255, 99, 132)',
                            'rgb(54, 162, 235)',
                            'rgb(255, 205, 86)'
                            ],
                            hoverOffset: 4
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            })
            
            .catch(err => console.log(err))
}
    
function getCharacterRealtionshipData(uid) {
        fetch(`/api/stats/${uid}/characters/`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': csrftoken
            }
        })
            .then(response => response.json())
            .then(data => {
                const characterNames = []
                const characterAffiliations = []
                const characterData = []
                let mostPopular = {
                    name: '',
                    affiliations: 0
                }
                let leastPopular = {
                    name: '',
                    affiliations: 0
                }
                let oldest = {
                    name: '',
                    age: 0
                }
                let youngest = {
                    name: '',
                    age: 0
                }
                
                data.forEach(item => {
                    characterNames.push(item.name)
                    characterAffiliations.push(item.affiliations.length)
                    characterData.push({
                        name: item.name,
                        affiliations: item.affiliations.length,
                        age: item.age
                    });
                });
                console.log(characterData)
                characterData.forEach(character => {
                    if (mostPopular.affiliations <= character.affiliations) {
                        mostPopular.affiliations = character.affiliations;
                        mostPopular.name = character.name;
                    }
                    if (leastPopular.affiliations >= character.affiliations) {
                        leastPopular.affiliations = character.affiliations;
                        leastPopular.name = character.name;
                    }
                    if (oldest.age <= character.age) {
                        oldest.age = character.age;
                        oldest.name = character.name;
                    }
                    if (youngest.age >= character.age) {
                        youngest.age = character.age;
                        youngest.name = character.name;
                    }
                })
                if (youngest.age == null) {
                    youngest.age = 0;
                }

                if (oldest.age == null) {
                    oldest.age == 0;
                }

                console.log(oldest)
                console.log(youngest)

                document.querySelector('#most-popular').textContent = `${mostPopular.name} has the most friends`
                document.querySelector('#least-popular').textContent = `${leastPopular.name} is (one of) the loneliest.`
                document.querySelector('#oldest-character').textContent = `${oldest.name} is the oldest (and wisest).`
                document.querySelector('#youngest-character').textContent = `${youngest.name} is the most naiive to this world.`

                const newCharacterReationshipChart = new Chart(characterRelationshipChart, {
                    type: 'bar',
                    data: {
                        labels: characterNames,
                        datasets: [{
                            label: 'Number of Affiliations',
                            data: characterAffiliations,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                })

            })
            .catch(err => console.log(err))
}


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