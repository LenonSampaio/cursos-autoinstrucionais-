// Accessibility helpers for active navigation state and keyboard access.
(() => {
    function normalizePath(pathname) {
        const normalized = pathname.replace(/\\/g, '/').replace(/\/index\.html$/, '/');
        return normalized.endsWith('/') ? normalized : normalized.replace(/\/$/, '');
    }

    function markCurrentLinks() {
        const currentPath = normalizePath(window.location.pathname);

        document.querySelectorAll('a[href]').forEach(link => {
            const url = new URL(link.getAttribute('href'), window.location.href);
            if (url.origin !== window.location.origin) return;

            const linkPath = normalizePath(url.pathname);
            const isCurrent = linkPath === currentPath;

            if (isCurrent) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });

        document.querySelectorAll('.submenu').forEach(submenu => {
            if (submenu.querySelector('a[aria-current="page"]')) {
                submenu.classList.add('open');
            }
        });
    }

    function makeSidebarHeadersKeyboardFriendly() {
        document.querySelectorAll('.menu-item[onclick], .menu-item[data-submenu-target]').forEach(item => {
            if (item.tagName === 'A') return;
            item.setAttribute('role', 'button');
            item.setAttribute('tabindex', '0');

            item.addEventListener('keydown', event => {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                event.preventDefault();
                item.click();
            });
        });
    }

    function initializeAccessibility() {
        markCurrentLinks();
        makeSidebarHeadersKeyboardFriendly();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeAccessibility);
    } else {
        initializeAccessibility();
    }

    document.addEventListener('components:loaded', initializeAccessibility);
})();
