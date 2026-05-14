(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const revealSelector = [
        '.card-modulo',
        '.home-section',
        '.custom-card',
        '.quote-card',
        '.importante-card',
        '.conteudo-relevante-box',
        '.organizacao-flip-card',
        '.aula3-purple-list',
        '.aula3-resource-card',
        '.aula3-figure',
        '.aula3-wide-image',
        '.aula3-cycle-image',
        '.aula3-relation-image',
        '.aula3-note-card',
        '.aula3-structure-card',
        '.aula3-media-card',
        '.aula3-timeline-item'
    ].join(',');

    function initializeScrollReveal() {
        const revealItems = document.querySelectorAll(revealSelector);

        if (!revealItems.length) {
            return;
        }

        if (prefersReducedMotion || !('IntersectionObserver' in window)) {
            revealItems.forEach(item => item.classList.add('is-visible'));
            return;
        }

        const observer = new IntersectionObserver((entries, currentObserver) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                } else {
                    entry.target.classList.remove('is-visible');
                }
            });
        }, {
            rootMargin: '0px 0px -12% 0px',
            threshold: 0.12
        });

        revealItems.forEach(item => observer.observe(item));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeScrollReveal);
    } else {
        initializeScrollReveal();
    }

    if (document.startViewTransition || prefersReducedMotion) {
        return;
    }

    document.addEventListener('click', event => {
        const link = event.target.closest('a[href]');

        if (!link) {
            return;
        }

        const url = new URL(link.href, window.location.href);
        const isSamePageAnchor = url.origin === window.location.origin
            && url.pathname === window.location.pathname
            && url.hash;

        if (
            event.defaultPrevented
            || event.button !== 0
            || event.metaKey
            || event.ctrlKey
            || event.shiftKey
            || event.altKey
            || link.target
            || link.hasAttribute('download')
            || url.origin !== window.location.origin
            || isSamePageAnchor
            || link.getAttribute('href') === '#'
        ) {
            return;
        }

        event.preventDefault();
        document.body.classList.add('page-is-leaving');
        window.setTimeout(() => {
            window.location.href = url.href;
        }, 160);
    });
})();
