document.addEventListener('DOMContentLoaded', () => {
  const confirmarEstadoModal = document.getElementById('confirmarEstadoModal');
  if (!confirmarEstadoModal) return;

  const confirmarBtn = document.getElementById('confirmarEstadoBtn');
  const modalTitle = document.getElementById('confirmarEstadoModalLabel');
  const modalBody = document.getElementById('confirmarEstadoModalBody');

  let activeButton = null;

  confirmarEstadoModal.addEventListener('show.bs.modal', (event) => {
    const button = event.relatedTarget;
    activeButton = button;

    const pacienteId = button.getAttribute('data-paciente-id');
    const nuevoEstado = button.getAttribute('data-nuevo-estado');
    const accionTexto = button.getAttribute('data-accion-texto');
    const btnClase = button.getAttribute('data-btn-clase');
    const titulo = button.getAttribute('data-titulo');

    modalTitle.textContent = titulo;
    modalBody.textContent = `¿Estás seguro de que deseas ${accionTexto} a este paciente?`;

    confirmarBtn.textContent = `Sí, ${accionTexto}`;
    confirmarBtn.className = `btn ${btnClase}`;

    confirmarBtn.setAttribute('data-paciente-id', pacienteId);
    confirmarBtn.setAttribute('data-nuevo-estado', nuevoEstado);
  });

  confirmarBtn.addEventListener('click', async () => {
    const pacienteId = confirmarBtn.getAttribute('data-paciente-id');
    if (!pacienteId) {
      return;
    }

    const nuevoEstado = confirmarBtn.getAttribute('data-nuevo-estado') === 'true';

    const originalButtonText = confirmarBtn.innerHTML;
    confirmarBtn.disabled = true;
    confirmarBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Procesando...`;

    try {
      const response = await fetch(`/api/pacientes/${pacienteId}/activo`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ activo: nuevoEstado }),
      });

      const result = await response.json();

      if (response.ok) {
        const modal = bootstrap.Modal.getInstance(confirmarEstadoModal);
        modal.hide();

        mostrarAlerta(result.message, 'success');
        actualizarBotonDeEstado(activeButton, nuevoEstado);
      } else {
        mostrarAlerta(result.message || 'Ocurrió un error.', 'danger');
      }
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      mostrarAlerta('No se pudo conectar con el servidor.', 'danger');
    } finally {
      confirmarBtn.disabled = false;
      confirmarBtn.innerHTML = originalButtonText;
    }
  });

  function actualizarBotonDeEstado(button, esActivo) {
    const icon = button.querySelector('i');
    const accionTexto = esActivo ? 'dar de baja' : 'dar de alta';
    const textoBoton = esActivo ? 'Eliminar' : 'Activar';
    const titulo = esActivo ? 'Confirmar Baja de Paciente' : 'Confirmar Alta de Paciente';
    const nuevaClase = esActivo ? 'btn-outline-danger' : 'btn-outline-success';
    const claseAntigua = esActivo ? 'btn-outline-success' : 'btn-outline-danger';

    button.classList.remove(claseAntigua);
    button.classList.add(nuevaClase);
    icon.className = esActivo ? 'bi bi-person-x-fill me-2' : 'bi bi-person-check-fill me-2';
    button.innerHTML = `${icon.outerHTML} ${textoBoton}`;
    button.setAttribute('data-nuevo-estado', String(!esActivo));
    button.setAttribute('data-accion-texto', accionTexto);
    button.setAttribute('data-titulo', titulo);
  }
});