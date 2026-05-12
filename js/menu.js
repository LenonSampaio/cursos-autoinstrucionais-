fetch('../menu.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('menu-container').innerHTML = data;
  });

// botão mobile
function toggleSidebar() {
    document.getElementById('sidebarMenu').classList.toggle('show');
}
 
