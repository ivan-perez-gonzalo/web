document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling para la navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });

            // Opcional: Cerrar menú si fuera móvil (no implementado en este CSS básico)
            // const navLinks = document.querySelector('.nav-links');
            // if (navLinks.classList.contains('active')) {
            //     navLinks.classList.remove('active');
            // }
        });
    });

    // Añadir clase 'active' al enlace de navegación actual
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    function highlightNavMenu() {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 80; // Ajusta 80px para el header fijo
            if (scrollY >= sectionTop) {
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
    highlightNavMenu(); // Llamar al cargar para resaltar la sección inicial
});
