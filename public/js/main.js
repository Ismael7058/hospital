document.addEventListener('DOMContentLoaded', function () {
  const sidebarToggler = document.getElementById('sidebarToggle');
  const body = document.body;

  if (sidebarToggler) {
    sidebarToggler.addEventListener('click', function (event) {
      // No es necesario event.preventDefault() ya que el botón no tiene acción por defecto
      body.classList.toggle('sidebar-collapsed');
    });
  }
});