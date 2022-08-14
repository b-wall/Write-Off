const csrftoken = getCookie('csrftoken');
const uid = document.querySelector('#user-profile-text').dataset.id;
const genreChart = document.getElementById('genre-chart');
const timelineCompletionChart = document.getElementById('timeline-completion-chart');
const characterRelationshipChart = document.getElementById('character-relationship-chart');
const characterBreakdownChart = document.getElementById('character-breakdown-chart');


// If Intersecting, trigger API Call and Display Data
const chartObserver = new IntersectionObserver((obs) => {
    obs.forEach(ob => {
        if (ob.isIntersecting) {
            getCharacterRelationshipData(uid);
            chartObserver.unobserve(ob.target);
        }
    })
}, {
    threshold: 0.9,
})

const circleChartObserver = new IntersectionObserver((obs) => {
    obs.forEach(ob => {
        if (ob.isIntersecting) {
            getGenreData(uid);
            getTimelineCompletionData(uid);
            getCharacterBreakdownData(uid);
            circleChartObserver.unobserve(ob.target);
        }
    })
}, {
    threshold: 0.3,
})

const circleCharts = document.querySelector('.user-stats-graphs-container');
const characterChart = document.querySelector('.character-chart-container');

circleChartObserver.observe(circleCharts);
chartObserver.observe(characterChart);


// Fetch Data Functions

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
                            data: Object.values(labels),
                            backgroundColor: [
                            'rgb(255, 99, 132)',
                            'rgb(54, 162, 235)',
                            'rgb(255, 205, 86)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)',
                            ],
                            hoverOffset: 4
                        }]
                        },
                    options: {
                        responsive: true,
                        plugins: {
                            labels: {
                                render: 'percentage',
                                fontSize: 18,
                                fontColor: '#fff',
                                textShadow: true,
                            }
                        },                        
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
                            'rgb(255, 205, 86)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)',
                            ],
                            hoverOffset: 4
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                display: false,
                            },
                            labels: {
                                render: 'percentage',
                                fontSize: 32,
                                fontColor: '#fff',
                                textShadow: true,
                            }
                        },
                    }
                });
            })
            
            .catch(err => console.log(err))
}

function getCharacterBreakdownData(uid) {
    fetch(`/api/stats/${uid}/characters/count/`, {
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
                    labels[item.project] = (labels[item.project] || 0) + 1;
                })
            const newCharacterBreakdownChart = new Chart(characterBreakdownChart, {
                type: 'pie',
                data: {
                    labels: Object.keys(labels),
                    datasets: [{
                        label: 'Timeline Item Completion',
                        data: Object.values(labels),
                        backgroundColor: [
                            'rgb(255, 99, 132)',
                            'rgb(54, 162, 235)',
                            'rgb(255, 205, 86)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)',
                        ],
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        labels: {
                            render: 'value',
                            fontSize: 32,
                            fontColor: '#fff',
                            textShadow: true,
                        }
                    },
                }
            });
        })
        .catch(err => console.log(err))
}
    
function getCharacterRelationshipData(uid) {
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
                    affiliations: -Infinity
                }
                let leastPopular = {
                    name: '',
                    affiliations: Infinity
                }
                let oldest = {
                    name: '',
                    age: -Infinity
                }
                let youngest = {
                    name: '',
                    age: Infinity
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

                    if (character.age !== null) {
                        if (youngest.age >= character.age) {
                            youngest.age = character.age;
                            youngest.name = character.name;
                        }
                    }
                })
                
                document.querySelector('#most-popular').textContent = `${mostPopular.name ? mostPopular.name : '???'} has the most friends`
                document.querySelector('#least-popular').textContent = `${leastPopular.name ? leastPopular.name : '???'} is (one of) the loneliest`
                document.querySelector('#oldest-character').textContent = `${oldest.name ? oldest.name : '???'} is the oldest (and wisest)`
                document.querySelector('#youngest-character').textContent = `${youngest.name ? youngest.name : '???'} is the youngest`

                let delayed;
                const newCharacterReationshipChart = new Chart(characterRelationshipChart, {
                    type: 'bar',
                    data: {
                        labels: characterNames,
                        datasets: [{
                            label: 'Number of Affiliations',
                            data: characterAffiliations,
                            backgroundColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)',
                            ],
                        }]
                    },
                    options: {
                        layout: {
                            padding: {
                                top: 25
                            }
                        },
                        maintainAspectRatio: false,
                        animation: {
                            onComplete: () => {
                                delayed = true;
                            },
                            delay: (context) => {
                                let delay = 0;
                                if (context.type === 'data' && context.mode === 'default' && !delayed) {
                                delay = context.dataIndex * 300 + context.datasetIndex * 100;
                                }
                                return delay;
                            },
                        },
                        responsive: true,
                        plugins: {
                            legend: {
                                display: false,
                            },
                            labels: {
                                render: 'value',
                                fontSize: 22,
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                grid: {
                                    display: false
                                }
                            },
                            x: {
                                grid: {
                                    display: false
                                }
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