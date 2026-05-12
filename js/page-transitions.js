(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
