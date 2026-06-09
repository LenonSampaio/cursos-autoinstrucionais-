/**
 * COMPONENT LOADER - Sistema de inclusao de componentes reutilizaveis.
 *
 * Containers suportados:
 * - #navbar-container
 * - #sidebar-container
 * - #footer-container
 * - #tarja-container
 */

function getProjectRoot() {
    const script = document.currentScript || document.querySelector('script[src$="component-loader.js"]');

    if (script && script.src) {
        return new URL('../', script.src).href;
    }

    const path = window.location.pathname.replace(/\\/g, '/');
    const depth = path.split('/').filter(Boolean).length - 1;
    return depth > 0 ? '../'.repeat(depth) : './';
}

function loadComponents() {
    const root = getProjectRoot();
    const components = [
        ['navbar-container', `${root}components/navbar.html`, 'navbar'],
        ['sidebar-container', `${root}components/sidebar.html`, 'sidebar'],
        ['footer-container', `${root}components/footer.html`, 'footer'],
        ['tarja-container', `${root}components/tarja.html`, 'tarja'],
        ['sidebar-overlay-container', `${root}components/navigation.html`, 'overlay']
    ];

    components.forEach(([containerId, componentPath, componentType]) => {
        const container = document.getElementById(containerId);
        if (container) {
            loadComponent(componentPath, container, componentType, root);
        }
    });
}

function loadComponent(componentPath, targetElement, componentType, root = getProjectRoot()) {
    fetch(componentPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao carregar componente: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            const normalizedHtml = html.replaceAll('{{ROOT}}', root);
            const parser = new DOMParser();
            const doc = parser.parseFromString(normalizedHtml, 'text/html');
            let componentElement = null;

            switch (componentType) {
                case 'navbar':
                    componentElement = doc.querySelector('.navbar');
                    break;
                case 'sidebar':
                    componentElement = doc.querySelector('.sidebar, .sidebar-wrapper');
                    break;
                case 'overlay':
                    componentElement = doc.querySelector('.sidebar-overlay');
                    break;
                case 'footer':
                    targetElement.innerHTML = normalizedHtml;
                    initializeComponent(componentType);
                    return;
                case 'tarja':
                    componentElement = doc.querySelector('.tarja-container');
                    break;
                default:
                    console.error(`Tipo de componente desconhecido: ${componentType}`);
                    return;
            }

            if (!componentElement) {
                console.error(`Componente ${componentType} nao encontrado no arquivo ${componentPath}`);
                return;
            }

            targetElement.innerHTML = '';
            targetElement.appendChild(componentElement);
            initializeComponent(componentType);
            document.dispatchEvent(new CustomEvent('components:loaded', { detail: { componentType } }));
        })
        .catch(error => {
            console.error('Erro ao carregar componente:', error);
            targetElement.innerHTML = `<div class="alert alert-danger">Erro ao carregar ${componentType}</div>`;
        });
}

function initializeComponent(componentType) {
    if (componentType === 'sidebar' || componentType === 'navbar' || componentType === 'overlay') {
        initializeSidebarCascade();
        initializeMobileSidebar();
    }
}

function initializeSidebarCascade() {
    document.querySelectorAll('.menu-item[data-submenu-target]').forEach(item => {
        if (item.dataset.bound === 'true') return;
        item.dataset.bound = 'true';

        item.addEventListener('click', () => {
            const target = document.getElementById(item.dataset.submenuTarget);
            if (!target) return;

            document.querySelectorAll('.submenu').forEach(sub => {
                if (sub !== target) sub.classList.remove('open');
            });

            target.classList.toggle('open');
        });
    });

    document.querySelectorAll('.sidebar-toggle').forEach(button => {
        if (button.dataset.bound === 'true') return;
        button.dataset.bound = 'true';

        button.addEventListener('click', () => {
            const target = document.getElementById(button.dataset.target);
            if (!target) return;

            const isOpen = target.classList.contains('show');
            document.querySelectorAll('.sidebar-submenu').forEach(sub => sub.classList.remove('show'));
            document.querySelectorAll('.sidebar-toggle').forEach(btn => btn.classList.remove('expanded'));

            if (!isOpen) {
                target.classList.add('show');
                button.classList.add('expanded');
            }
        });
    });
}

function initializeMobileSidebar() {
    const sidebarToggle = document.getElementById('sidebarToggle') || document.getElementById('mobileSidebarToggle');
    const sidebar = document.querySelector('.sidebar-wrapper') || document.querySelector('.sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    if (!sidebar) return;

    const sidebarClose = ensureSidebarCloseButton(sidebar);

    if (sidebarToggle && sidebarToggle.dataset.bound !== 'true') {
        sidebarToggle.dataset.bound = 'true';
        sidebarToggle.addEventListener('click', () => {
            const isOpen = sidebar ? sidebar.classList.toggle('mobile-open') : false;
            const currentOverlay = document.getElementById('sidebarOverlay');
            if (currentOverlay) currentOverlay.classList.toggle('active', isOpen);
            sidebarToggle.classList.toggle('is-open', isOpen);
            sidebarToggle.setAttribute('aria-expanded', String(isOpen));
        });
    }

    if (sidebarOverlay && sidebarOverlay.dataset.bound !== 'true') {
        sidebarOverlay.dataset.bound = 'true';
        sidebarOverlay.addEventListener('click', closeMobileSidebar);
    }

    if (sidebarClose && sidebarClose.dataset.bound !== 'true') {
        sidebarClose.dataset.bound = 'true';
        sidebarClose.addEventListener('click', closeMobileSidebar);
    }

    document.querySelectorAll('.submenu-link, .submenu a').forEach(link => {
        if (link.dataset.bound === 'true') return;
        link.dataset.bound = 'true';
        link.addEventListener('click', closeMobileSidebar);
    });

    function closeMobileSidebar() {
        if (sidebar) sidebar.classList.remove('mobile-open');
        const currentOverlay = document.getElementById('sidebarOverlay');
        if (currentOverlay) currentOverlay.classList.remove('active');
        if (sidebarToggle) {
            sidebarToggle.classList.remove('is-open');
            sidebarToggle.setAttribute('aria-expanded', 'false');
        }
    }
}

function ensureSidebarCloseButton(sidebar) {
    if (!sidebar) return null;

    const existingButton = sidebar.querySelector('.sidebar-close');
    if (existingButton) return existingButton;

    const button = document.createElement('button');
    button.className = 'sidebar-close';
    button.type = 'button';
    button.setAttribute('aria-label', 'Fechar menu lateral');
    button.innerHTML = '&times;';

    const target = sidebar.querySelector('.sticky-sidebar') || sidebar;
    target.prepend(button);

    return button;
}

document.addEventListener('DOMContentLoaded', loadComponents);

window.ComponentLoader = {
    loadComponents,
    loadComponent,
    initializeSidebarCascade,
    initializeMobileSidebar,
    ensureSidebarCloseButton
};
