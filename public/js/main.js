document.addEventListener('DOMContentLoaded', function () {
  const sidebarToggler = document.getElementById('sidebarToggle');
  const body = document.body;

  if (sidebarToggler) {
    sidebarToggler.addEventListener('click', function (event) {
      // No es necesario event.preventDefault() ya que el botón no tiene acción por defecto
      body.classList.toggle('sidebar-collapsed');
    });
  }

    const serverAlerts = document.querySelectorAll('#alert-container .alert');
    serverAlerts.forEach(alert => {
        setTimeout(() => {
            // Usamos el método de Bootstrap para cerrar la alerta con una animación suave
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 5000); // 5 segundos
    });

});

function mostrarAlerta(message, type = 'info') {
    const alertContainer = document.getElementById('alert-container');
    if (!alertContainer) {
        console.error('El contenedor #alert-container no existe.');
        return;
    }

    const alertElement = document.createElement('div');
    // Usamos las clases de Bootstrap para que se pueda cerrar y tenga animación
    alertElement.className = `alert alert-${type} alert-dismissible fade show shadow-sm mt-3`;
    alertElement.setAttribute('role', 'alert');
    alertElement.innerHTML = `${message}<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`;
    
    alertContainer.append(alertElement);
    setTimeout(() => {
        const bsAlert = new bootstrap.Alert(alertElement);
        bsAlert.close();
    }, 5000); // 5 segundos
}