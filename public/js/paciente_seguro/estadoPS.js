document.addEventListener('DOMContentLoaded', () => {
  const confirmarEstadoModalEl = document.getElementById('confirmarEstadoSeguroPacienteModal');
  if (!confirmarEstadoModalEl) return;

  const confirmarEstadoModal = new bootstrap.Modal(confirmarEstadoModalEl);
  const modalTitle = document.getElementById('confirmarEstadoSeguroPacienteModalLabel');
  const modalBody = document.getElementById('confirmarEstadoSeguroPacienteModalBody');
  const confirmarBtn = document.getElementById('confirmarEstadoSeguroPacienteBtn');

  let activeButton = null;
  let pacienteSeguroId = null;
  let nuevoEstado = null;
  
  const tabla = document.querySelector('.table');
  if (tabla) {
    tabla.addEventListener('click', (event) => {
      const button = event.target.closest('.btn-toggle-activo');
      if (!button) return;

      activeButton = button;
      pacienteSeguroId = activeButton.getAttribute('data-id');
      const estadoActual = activeButton.getAttribute('data-activo') === 'true';
      nuevoEstado = !estadoActual;

      const accionTexto = nuevoEstado ? 'activar' : 'desactivar';
      modalTitle.textContent = `Confirmar ${nuevoEstado ? 'Activación' : 'Desactivación'}`;
      modalBody.textContent = `¿Estás seguro de que deseas ${accionTexto} este seguro?`;
      confirmarBtn.textContent = `Sí, ${accionTexto}`;
      confirmarBtn.className = `btn ${nuevoEstado ? 'btn-success' : 'btn-danger'}`;

      confirmarEstadoModal.show();
    });
  }

  confirmarBtn.addEventListener('click', async () => {
    if (!pacienteSeguroId) return;

    const originalButtonText = confirmarBtn.innerHTML;
    confirmarBtn.disabled = true;
    confirmarBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Procesando...`;

    try {
      const response = await fetch(`/api/paciente-seguros/${pacienteSeguroId}/activo`, {
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
      console.error('Error al cambiar estado del seguro:', error);
      mostrarAlerta('No se pudo conectar con el servidor.', 'danger');
    } finally {
      confirmarBtn.disabled = false;
      confirmarBtn.innerHTML = originalButtonText;
      confirmarEstadoModal.hide();
      pacienteSeguroId = null;
      activeButton = null;
    }
  });

  function actualizarUI(button, esActivo) {
    const fila = button.closest('tr');
    const badgeEstado = fila.cells[4].querySelector('.badge');
    badgeEstado.textContent = esActivo ? 'Activo' : 'Inactivo';
    badgeEstado.className = `badge ${esActivo ? 'bg-success' : 'bg-danger'}`;

    const titulo = esActivo ? 'Desactivar seguro' : 'Activar seguro';
    const nuevaClase = esActivo ? 'btn-outline-danger' : 'btn-outline-success';
    const claseAntigua = esActivo ? 'btn-outline-success' : 'btn-outline-danger';
    const nuevoIcono = esActivo ? 'bi bi-toggle-off' : 'bi bi-toggle-on';

    button.classList.remove(claseAntigua);
    button.classList.add(nuevaClase);
    button.setAttribute('data-activo', String(esActivo));
    button.setAttribute('title', titulo);
    const icon = button.querySelector('i');
    if (icon) {
      icon.className = nuevoIcono;
    }

    // Forzar la actualización del contenido del tooltip de Bootstrap para que muestre el nuevo título
    const tooltip = bootstrap.Tooltip.getInstance(button);
    if (tooltip) {
      tooltip.setContent({ '.tooltip-inner': titulo });
    }
  }
});