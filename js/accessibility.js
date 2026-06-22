// Accessibility helpers for active navigation state and keyboard access.
(() => {
    function normalizePath(pathname) {
        const normalized = pathname
            .replace(/\\/g, '/')
            .replace(/\/index\.html$/i, '/')
            .replace(/\.html$/i, '');

        const withoutTrailingSlash = normalized.endsWith('/') && normalized !== '/'
            ? normalized.slice(0, -1)
            : normalized;

        return withoutTrailingSlash.toLowerCase();
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
                const moduleTrigger = submenu.previousElementSibling;

                if (moduleTrigger && moduleTrigger.classList.contains('menu-item')) {
                    moduleTrigger.classList.add('active');
                    moduleTrigger.setAttribute('aria-expanded', 'true');
                }
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

    function initializeAuxiliaryNavbar() {
        document.querySelectorAll('.glossario-navbar').forEach(navbar => {
            const toggle = navbar.querySelector('.aux-navbar-toggler, .navbar-toggler');
            const menu = navbar.querySelector('.navbar-collapse');

            if (!toggle || !menu) return;
            if (toggle.dataset.auxNavbarInitialized === 'true') return;
            toggle.dataset.auxNavbarInitialized = 'true';

            const syncToggleVisibility = () => {
                const isMobile = window.matchMedia('(max-width: 991.98px)').matches;
                toggle.style.setProperty('display', isMobile ? 'inline-flex' : 'none', 'important');

                if (isMobile) {
                    toggle.style.setProperty('position', 'absolute', 'important');
                    toggle.style.setProperty('top', '21px', 'important');
                    toggle.style.setProperty('right', '16px', 'important');
                    toggle.style.setProperty('z-index', '10', 'important');
                } else {
                    menu.classList.remove('show');
                    toggle.setAttribute('aria-expanded', 'false');
                }
            };

            syncToggleVisibility();
            window.addEventListener('resize', syncToggleVisibility);

            toggle.addEventListener('click', event => {
                event.preventDefault();
                event.stopPropagation();
                const isOpen = menu.classList.toggle('show');
                toggle.setAttribute('aria-expanded', String(isOpen));
            }, true);

            menu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    menu.classList.remove('show');
                    toggle.setAttribute('aria-expanded', 'false');
                });
            });
        });
    }

    function initializeAccessibility() {
        markCurrentLinks();
        makeSidebarHeadersKeyboardFriendly();
        initializeAuxiliaryNavbar();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeAccessibility);
    } else {
        initializeAccessibility();
    }

    document.addEventListener('components:loaded', initializeAccessibility);
})();
