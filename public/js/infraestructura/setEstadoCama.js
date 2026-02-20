document.addEventListener('DOMContentLoaded', () => {
  const confirmarCambioEstadoModalEl = document.getElementById('confirmarCambioEstadoCamaModal');
  if (!confirmarCambioEstadoModalEl) return;

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
      const btnClase = button.getAttribute('data-btn-clase') || (nuevoEstado === 'Libre' ? 'btn-success' : 'btn-warning');

      modalTitle.textContent = titulo;
      modalBody.textContent = `¿Estás seguro de que deseas ${accionTexto}?`;
      
      confirmarBtn.className = 'btn fw-bold text-uppercase small';
      const colorClass = btnClase.replace('btn-outline-', 'btn-');
      confirmarBtn.classList.add(colorClass);
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
          actualizarUI(activeStateButton, nuevoEstado, camaId);
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


  function actualizarUI(button, nuevoEstado, camaId) {
    // La vista para listar incorpara el script de la funcion
    if (button.closest('tr')) {
      actualizarUITabla(button, nuevoEstado, camaId);
    } 
    // La vista del dashboard incorpara el script de la funcion
    else if (button.closest('.card-body')) {
      actualizarUIDashboard(button, nuevoEstado, camaId);
    }
  }




});