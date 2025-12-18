document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initPageTransitions();
});

/**
 * Initializes the custom cursor and its hover states.
 * The cursor follows the mouse and reacts to elements with specific selectors.
 */
function initCursor() {
    const cursor = document.querySelector('.cursor');
    if (!cursor) return;

    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1,
            ease: "power2.out"
        });
    });

    // Handle hover states for interactive elements
    const hoverables = document.querySelectorAll('a, button, .card, [data-hover]');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hovered');

            // Check for custom hover text attribute
            const text = el.getAttribute('data-hover');
            if (text) cursor.textContent = text;
        });

        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovered');
            cursor.textContent = '';
        });
    });
}

/**
 * Initializes global page transitions.
 * Intercepts link clicks to perform an exit animation before navigation.
 */
function initPageTransitions() {
    const links = document.querySelectorAll('a[href]:not([target="_blank"])');
    const transitionEl = document.querySelector('.page-transition');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            // Ignore anchors and external links
            if (href.startsWith('#') || href.includes('http')) return;

            e.preventDefault();

            // Exit Animation: Rotate out current page and slide in overlay
            const tl = gsap.timeline({
                onComplete: () => window.location.href = href
            });

            tl.to('main', {
                rotationY: -90,
                opacity: 0,
                scale: 0.8,
                duration: 0.6,
                ease: "power2.in"
            })
                .to(transitionEl, {
                    y: '0%',
                    duration: 0.4,
                    ease: "expo.out"
                }, "-=0.2");
        });
    });
}

/**
 * Initializes a 3D Tilt effect on specific elements.
 * @param {NodeListOf<Element>|Array<Element>} elements - The elements to apply tilt to.
 */
function initTilt(elements) {
    elements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();

            // Calculate mouse position relative to element center
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Calculate rotation (Max 10 degrees)
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            gsap.to(el, {
                rotationX: rotateX,
                rotationY: rotateY,
                transformPerspective: 1000,
                duration: 0.4,
                ease: "power2.out"
            });
        });

        // Reset transform on leave
        el.addEventListener('mouseleave', () => {
            gsap.to(el, {
                rotationX: 0,
                rotationY: 0,
                duration: 0.5,
                ease: "elastic.out(1, 0.5)"
            });
        });
    });
}
