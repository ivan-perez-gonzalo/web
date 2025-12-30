document.addEventListener('DOMContentLoaded', () => {
    // === 1. LÓGICA DE NAVEGACIÓN Y SCROLL ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    function highlightNavMenu() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 80;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').includes(current)) {
                a.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', highlightNavMenu);
    highlightNavMenu();

    // === 2. LÓGICA DE LOS CONTADORES CIRCULARES (PROPÓSITOS 2026) ===
    const goals = [
        { id: 'gym', emoji: '💪', title: 'Gimnasio', target: 200 },
        { id: 'run', emoji: '🏃', title: 'Correr', target: 50 },
        { id: 'books', emoji: '📚', title: 'Leer Libros', target: 12 },
        { id: 'water', emoji: '💧', title: 'Beber Agua', target: 365 },
        { id: 'meditate', emoji: '🧘', title: 'Meditar', target: 100 },
        { id: 'code', emoji: '💻', title: 'Programar', target: 150 },
        { id: 'travel', emoji: '✈️', title: 'Viajar', target: 6 },
        { id: 'savings', emoji: '💰', title: 'Ahorrar', target: 12 },
        { id: 'healthy', emoji: '🥗', title: 'Comer Sano', target: 250 },
        { id: 'digital-detox', emoji: '📵', title: 'Desconexión', target: 300 }
    ];

    const container = document.getElementById('counters-container');
    
    // --- CONSTANTES PARA EL CÍRCULO ---
    // Radio del círculo. Si el viewBox es 150x150, el centro es 75,75.
    // Un radio de 65 deja 10px de margen total (5px por lado) para el grosor de la línea.
    const radius = 65;
    const circumference = 2 * Math.PI * radius;

    function getProgress(id) {
        return parseInt(localStorage.getItem('goal_' + id)) || 0;
    }

    function saveProgress(id, value) {
        localStorage.setItem('goal_' + id, value);
    }

    function renderCounters() {
        if (!container) return;
        container.innerHTML = ''; 
        goals.forEach(goal => {
            const current = getProgress(goal.id);

            const card = document.createElement('div');
            card.className = 'counter-card';

            // --- AQUÍ ESTABA EL ERROR DEL UNDEFINED ---
            // Se ha corregido la estructura HTML interna
            card.innerHTML = `
                <div class="circular-progress-container">
                    <svg class="progress-ring-svg" width="150" height="150" viewBox="0 0 150 150">
                        <circle class="progress-ring-circle-bg" cx="75" cy="75" r="${radius}"></circle>
                        <circle class="progress-ring-circle" id="circle-${goal.id}"
                            cx="75" cy="75" r="${radius}"
                            style="stroke-dasharray: ${circumference}; stroke-dashoffset: ${circumference};">
                        </circle>
                    </svg>
                    <div class="inner-content">
                        <span class="inner-emoji">${goal.emoji}</span>
                        <span class="inner-value" id="val-${goal.id}">${current} / ${goal.target}</span>
                    </div>
                </div>
                <h3>${goal.title}</h3>
            `;

            card.addEventListener('click', () => {
                let count = getProgress(goal.id);
                if (count < goal.target) {
                    count++;
                    saveProgress(goal.id, count);
                    updateUI(goal.id, count, goal.target);
                }
            });

            container.appendChild(card);
            // Pequeño retraso para que la animación se vea al cargar
            setTimeout(() => updateUI(goal.id, current, goal.target), 50);
        });
    }

    function updateUI(id, current, target) {
        const textElement = document.getElementById(`val-${id}`);
        const circleElement = document.getElementById(`circle-${id}`);
        
        if (textElement) textElement.innerText = `${current} / ${target}`;
        
        if (circleElement) {
            const progressDecimal = Math.min(current / target, 1);
            const offset = circumference - (progressDecimal * circumference);
            circleElement.style.strokeDashoffset = offset;

            // Color de éxito
            if (current >= target) {
                 circleElement.style.stroke = '#28a745'; 
            } else {
                 circleElement.style.stroke = '#007bff'; // Color original
            }
        }
    }

    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm('¿Seguro que quieres reiniciar todos tus propósitos a cero?')) {
                goals.forEach(goal => localStorage.removeItem('goal_' + goal.id));
                renderCounters();
            }
        });
    }

    renderCounters();
});
