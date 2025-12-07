document.addEventListener('DOMContentLoaded', () => {
  const confirmarEstadoModalEl = document.getElementById('confirmarEstadoAlaModal');
  if (!confirmarEstadoModalEl) return;

  const confirmarEstadoModal = new bootstrap.Modal(confirmarEstadoModalEl);
  const modalTitle = document.getElementById('confirmarEstadoAlaModalLabel');
  const modalBody = document.getElementById('confirmarEstadoAlaModalBody');
  const confirmarBtn = document.getElementById('confirmarEstadoAlaBtn');

  let activeButton = null;
  let alaId = null;
  let nuevoEstado = null;
  
  const tabla = document.querySelector('.table');
  if (tabla) {
    tabla.addEventListener('click', (event) => {
      const button = event.target.closest('.btn-toggle-activo');
      if (!button) return;

      activeButton = button;
      alaId = activeButton.getAttribute('data-id');
      const estadoActual = activeButton.getAttribute('data-activo') === 'true';
      nuevoEstado = !estadoActual;

      const accionTexto = nuevoEstado ? 'activar' : 'desactivar';
      modalTitle.textContent = `Confirmar ${nuevoEstado ? 'Activación' : 'Desactivación'}`;
      modalBody.textContent = `¿Estás seguro de que deseas ${accionTexto} esta ala?`;
      confirmarBtn.textContent = `Sí, ${accionTexto}`;
      confirmarBtn.className = `btn ${nuevoEstado ? 'btn-success' : 'btn-danger'}`;

      confirmarEstadoModal.show();
    });
  }

  confirmarBtn.addEventListener('click', async () => {
    if (!alaId) return;

    const originalButtonText = confirmarBtn.innerHTML;
    confirmarBtn.disabled = true;
    confirmarBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Procesando...`;

    try {
      const response = await fetch(`/api/infraestructura/ala/${alaId}/activo`, {
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
      console.error('Error al cambiar estado del ala:', error);
      mostrarAlerta('No se pudo conectar con el servidor.', 'danger');
    } finally {
      confirmarBtn.disabled = false;
      confirmarBtn.innerHTML = originalButtonText;
      confirmarEstadoModal.hide();
      alaId = null;
      activeButton = null;
    }
  });

  function actualizarUI(button, esActivo) {
    const fila = button.closest('tr');
    const badgeEstado = fila.cells[3].querySelector('.badge');

    badgeEstado.textContent = esActivo ? 'Activa' : 'Inactiva';
    badgeEstado.className = `badge ${esActivo ? 'bg-success' : 'bg-danger'}`;

    // Actualizar el botón de acción
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