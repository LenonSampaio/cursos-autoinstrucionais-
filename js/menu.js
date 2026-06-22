const menuContainer = document.getElementById('menu-container');

if (menuContainer) {
    fetch('../home/menu.html')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Menu nao encontrado: ${response.status}`);
            }

            return response.text();
        })
        .then(data => {
            menuContainer.innerHTML = data;
        })
        .catch(error => {
            console.warn(error.message);
        });
}

function toggleSidebar() {
    const sidebarMenu = document.getElementById('sidebarMenu');

    if (sidebarMenu) {
        sidebarMenu.classList.toggle('show');
    }
}
