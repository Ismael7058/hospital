document.addEventListener('DOMContentLoaded', function () {
  const sidebarToggler = document.querySelector('button[data-bs-target="#sidebarMenu"]');
  const body = document.body;

  if (sidebarToggler) {
    sidebarToggler.addEventListener('click', function (event) {
      event.preventDefault(); // Previene el comportamiento de colapso de Bootstrap
      body.classList.toggle('sidebar-collapsed');
    });
  }
});