document.addEventListener('DOMContentLoaded', function () {
  // 1. Seleccionar todos los elementos que activan tooltips en el sidebar
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('#sidebarMenu [data-bs-toggle="tooltip"]'));

  // 2. Crear una lista de instancias de tooltips para poder manipularlos
  const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // 3. Función para habilitar o deshabilitar los tooltips
  function updateTooltipState() {
    const isCollapsed = document.body.classList.contains('sidebar-collapsed');
    tooltipList.forEach(tooltip => {
      if (isCollapsed) {
        tooltip.enable();
      } else {
        tooltip.disable();
      }
    });
  }

  // 4. Observar cambios en la clase del body para actualizar los tooltips dinámicamente
  const observer = new MutationObserver(updateTooltipState);
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

  // 5. Llamar a la función al cargar la página para establecer el estado inicial correcto
  updateTooltipState();
});