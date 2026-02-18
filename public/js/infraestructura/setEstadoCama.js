document.addEventListener('DOMContentLoaded', () => {
  const confirmarCambioEstadoModalEl = document.getElementById('confirmarCambioEstadoCamaModal');
  if (confirmarCambioEstadoModalEl) {
    const confirmarCambioEstadoModal = new bootstrap.Modal(confirmarCambioEstadoModalEl);
    const modalTitle = document.getElementById('confirmarCambioEstadoCamaModalLabel');
    const modalBody = document.getElementById('confirmarCambioEstadoCamaModalBody');
    const confirmarBtn = document.getElementById('confirmarCambioEstadoCamaBtn');

    let activeStateButton = null;

    confirmarCambioEstadoModalEl.addEventListener('show.bs.modal', (event) => {
      const button = event.relatedTarget;
      activeStateButton = button;

      const camaId = button.getAttribute('data-cama-id');
      const nuevoEstado = button.getAttribute('data-nuevo-estado');
      const accionTexto = button.getAttribute('data-accion-texto');
      const titulo = button.getAttribute('data-titulo');
      const btnClase = button.getAttribute('data-btn-clase');

      modalTitle.textContent = titulo;
      modalBody.textContent = `¿Estás seguro de que deseas ${accionTexto}?`;
      
      confirmarBtn.className = `btn ${btnClase}`;
      confirmarBtn.setAttribute('data-cama-id', camaId);
      confirmarBtn.setAttribute('data-nuevo-estado', nuevoEstado);
    });

    confirmarBtn.addEventListener('click', async () => {
      const camaId = confirmarBtn.getAttribute('data-cama-id');
      const nuevoEstado = confirmarBtn.getAttribute('data-nuevo-estado');

      const originalButtonText = confirmarBtn.innerHTML;
      confirmarBtn.disabled = true;
      confirmarBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Procesando...`;

      try {
        const response = await fetch(`/api/infraestructura/cama/${camaId}/estado`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ estado: nuevoEstado })
        });

        const result = await response.json();

        if (response.ok) {
          mostrarAlerta(result.message, 'success');
          confirmarCambioEstadoModal.hide();
          actualizarUIEstado(activeStateButton, nuevoEstado, camaId);
        } else {
          mostrarAlerta(result.message || 'Ocurrió un error al cambiar el estado.', 'danger');
        }
      } catch (error) {
        console.error('Error al cambiar estado de la cama:', error);
        mostrarAlerta('No se pudo conectar con el servidor.', 'danger');
      } finally {
        confirmarBtn.disabled = false;
        confirmarBtn.innerHTML = originalButtonText;
      }
    });
  }

  function actualizarUIEstado(button, nuevoEstado, camaId) {
    const fila = button.closest('tr');
    const badge = fila.cells[3].querySelector('.badge');

    badge.textContent = nuevoEstado;
    badge.className = 'badge';
    if (nuevoEstado === 'Libre') badge.classList.add('bg-success');
    else if (nuevoEstado === 'Higienizando') badge.classList.add('bg-warning', 'text-dark');
    else if (nuevoEstado === 'Ocupado') badge.classList.add('bg-danger');

    const newButton = document.createElement('button');
    newButton.type = 'button';
    newButton.className = 'btn btn-sm';
    newButton.setAttribute('data-bs-toggle', 'modal');
    newButton.setAttribute('data-bs-target', '#confirmarCambioEstadoCamaModal');
    newButton.setAttribute('data-cama-id', camaId);

    if (nuevoEstado === 'Higienizando') {
      newButton.classList.add('btn-outline-success');
      newButton.setAttribute('data-nuevo-estado', 'Libre');
      newButton.setAttribute('data-accion-texto', 'finalizar la higienización y marcar la cama como libre');
      newButton.setAttribute('data-titulo', 'Confirmar Finalización');
      newButton.setAttribute('data-btn-clase', 'btn-outline-success');
      newButton.title = 'Finalizar Higienización';
      newButton.innerHTML = '<i class="bi bi-check-circle"></i>';
    } else if (nuevoEstado === 'Libre') {
      newButton.classList.add('btn-outline-warning');
      newButton.setAttribute('data-nuevo-estado', 'Higienizando');
      newButton.setAttribute('data-accion-texto', 'iniciar la higienización de esta cama');
      newButton.setAttribute('data-titulo', 'Confirmar Higienización');
      newButton.setAttribute('data-btn-clase', 'btn-outline-warning');
      newButton.title = 'Higienizar Cama';
      newButton.innerHTML = '<i class="bi bi-droplet-fill"></i>';
    }

    button.replaceWith(newButton);
  }
});