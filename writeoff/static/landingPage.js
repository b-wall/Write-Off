// Intersection Observer for Landing Page
const fadeObserver = new IntersectionObserver((obs) => {
    obs.forEach(ob => {
        if (ob.isIntersecting) {
            ob.target.classList.add('faded');
            fadeObserver.unobserve(ob.target);
        }
    })
}, {
    threshold: 0.5,
});

document.querySelectorAll('.fade-in').forEach(el => {
    fadeObserver.observe(el);
});

document.querySelectorAll('.user-stats-landing-card').forEach(el => {
    fadeObserver.observe(el);
});
