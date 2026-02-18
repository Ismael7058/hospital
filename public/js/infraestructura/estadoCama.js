document.addEventListener('DOMContentLoaded', () => {
  const confirmarEstadoModalEl = document.getElementById('confirmarEstadoCamaModal');
  if (!confirmarEstadoModalEl) return;

  const confirmarEstadoModal = new bootstrap.Modal(confirmarEstadoModalEl);
  const modalTitle = document.getElementById('confirmarEstadoCamaModalLabel');
  const modalBody = document.getElementById('confirmarEstadoCamaModalBody');
  const confirmarBtn = document.getElementById('confirmarEstadoCamaBtn');

  let activeButton = null;
  let camaId = null;
  let nuevoEstado = null;
  
  const tabla = document.querySelector('.table');
  if (tabla) {
    tabla.addEventListener('click', (event) => {
      const button = event.target.closest('.btn-toggle-activo');
      if (!button) return;

      activeButton = button;
      camaId = activeButton.getAttribute('data-id');
      const estadoActual = activeButton.getAttribute('data-activo') === 'true';
      nuevoEstado = !estadoActual;

      const accionTexto = nuevoEstado ? 'activar' : 'desactivar';
      modalTitle.textContent = `Confirmar ${nuevoEstado ? 'Activación' : 'Desactivación'}`;
      modalBody.textContent = `¿Estás seguro de que deseas ${accionTexto} esta cama?`;
      confirmarBtn.textContent = `Sí, ${accionTexto}`;
      confirmarBtn.className = `btn ${nuevoEstado ? 'btn-success' : 'btn-danger'}`;

      confirmarEstadoModal.show();
    });
  }

  confirmarBtn.addEventListener('click', async () => {
    if (!camaId) return;

    const originalButtonText = confirmarBtn.innerHTML;
    confirmarBtn.disabled = true;
    confirmarBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Procesando...`;

    try {
      const response = await fetch(`/api/infraestructura/cama/${camaId}/activo`, {
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
      console.error('Error al cambiar estado del cama:', error);
      mostrarAlerta('No se pudo conectar con el servidor.', 'danger');
    } finally {
      confirmarBtn.disabled = false;
      confirmarBtn.innerHTML = originalButtonText;
      confirmarEstadoModal.hide();
      camaId = null;
      activeButton = null;
    }
  });

  function actualizarUI(button, esActivo) {
    const fila = button.closest('tr');
    const badgeEstado = fila.cells[4].querySelector('.badge');

    badgeEstado.textContent = esActivo ? 'Activo' : 'Inactivo';
    badgeEstado.className = `badge ${esActivo ? 'bg-success' : 'bg-danger'}`;

    button.setAttribute('data-activo', String(esActivo));
    const icon = button.querySelector('i');
    if (esActivo) {
      icon.className = 'bi bi-toggle-off';
      button.innerHTML = `${icon.outerHTML}`;
    } else {
      icon.className = 'bi bi-toggle-on';
      button.innerHTML = `${icon.outerHTML}`;
    }
  }
});