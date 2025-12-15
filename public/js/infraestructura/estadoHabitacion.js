document.addEventListener('DOMContentLoaded', () => {
  const confirmarEstadoModalEl = document.getElementById('confirmarEstadoHabitacionModal');
  if (!confirmarEstadoModalEl) return;

  const confirmarEstadoModal = new bootstrap.Modal(confirmarEstadoModalEl);
  const modalTitle = document.getElementById('confirmarEstadoHabitacionModalLabel');
  const modalBody = document.getElementById('confirmarEstadoHabitacionModalBody');
  const confirmarBtn = document.getElementById('confirmarEstadoHabitacionBtn');

  let activeButton = null;
  let habitacionId = null;
  let nuevoEstado = null;
  
  const tabla = document.querySelector('.table');
  if (tabla) {
    tabla.addEventListener('click', (event) => {
      const button = event.target.closest('.btn-toggle-activo');
      if (!button) return;

      activeButton = button;
      habitacionId = activeButton.getAttribute('data-id');
      const estadoActual = activeButton.getAttribute('data-activo') === 'true';
      nuevoEstado = !estadoActual;

      const accionTexto = nuevoEstado ? 'activar' : 'desactivar';
      modalTitle.textContent = `Confirmar ${nuevoEstado ? 'Activación' : 'Desactivación'}`;
      modalBody.textContent = `¿Estás seguro de que deseas ${accionTexto} esta habitacion?`;
      confirmarBtn.textContent = `Sí, ${accionTexto}`;
      confirmarBtn.className = `btn ${nuevoEstado ? 'btn-success' : 'btn-danger'}`;

      confirmarEstadoModal.show();
    });
  }

  confirmarBtn.addEventListener('click', async () => {
    if (!habitacionId) return;

    const originalButtonText = confirmarBtn.innerHTML;
    confirmarBtn.disabled = true;
    confirmarBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Procesando...`;

    try {
      const response = await fetch(`/api/infraestructura/habitacion/${habitacionId}/activo`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo: nuevoEstado })
      });

      const result = await response.json();

      if (response.ok) {
        mostrarAlerta(result.message, 'success');
        actualizarUI(activeButton, nuevoEstado);
      } else {
        mostrarAlerta(result.message || 'Ocurrió un error al cambiar el estado.', 'danger');
      }
    } catch (error) {
      console.error('Error al cambiar estado del habitacion:', error);
      mostrarAlerta('No se pudo conectar con el servidor.', 'danger');
    } finally {
      confirmarBtn.disabled = false;
      confirmarBtn.innerHTML = originalButtonText;
      confirmarEstadoModal.hide();
      habitacionId = null;
      activeButton = null;
    }
  });

  function actualizarUI(button, esActivo) {
    const fila = button.closest('tr');
    const badgeEstado = fila.cells[5].querySelector('.badge');

    badgeEstado.textContent = esActivo ? 'Activo' : 'Inactivo';
    badgeEstado.className = `badge ${esActivo ? 'bg-success' : 'bg-danger'}`;

    button.setAttribute('data-activo', String(esActivo));
    const icon = button.querySelector('i');
    if (esActivo) {
      icon.className = 'bi bi-toggle-off me-1';
      button.innerHTML = `${icon.outerHTML} Desactivar`;
    } else {
      icon.className = 'bi bi-toggle-on me-1';
      button.innerHTML = `${icon.outerHTML} Activar`;
    }
  }
});