document.addEventListener('DOMContentLoaded', () => {
  const confirmarEstadoModal = document.getElementById('confirmarEstadoModal');
  if (!confirmarEstadoModal) return;

  const confirmarBtn = document.getElementById('confirmarEstadoBtn');
  const modalTitle = document.getElementById('confirmarEstadoModalLabel');
  const modalBody = document.getElementById('confirmarEstadoModalBody');

  // Variable para mantener una referencia al botón que activó el modal
  let activeButton = null;

  // Configurar el modal dinámicamente cuando se abre
  confirmarEstadoModal.addEventListener('show.bs.modal', (event) => {
    const button = event.relatedTarget; // El botón que activó el modal
    activeButton = button; // Guardamos la referencia al botón

    // Extraer información de los atributos data-*
    const matriculaId = button.getAttribute('data-matricula-id');
    const nuevoEstado = button.getAttribute('data-nuevo-estado');
    const accionTexto = button.getAttribute('data-accion-texto');
    const btnClase = button.getAttribute('data-btn-clase');
    const titulo = button.getAttribute('data-titulo');

    // Actualizar el contenido del modal
    modalTitle.textContent = titulo;
    modalBody.textContent = `¿Estás seguro de que deseas ${accionTexto} esta matrícula?`;

    // Actualizar el botón de confirmación
    confirmarBtn.textContent = `Sí, ${accionTexto}`;
    confirmarBtn.className = `btn ${btnClase}`; // Limpia clases anteriores y aplica la nueva

    // Guardar los datos en el botón de confirmación para usarlos en el evento click
    confirmarBtn.setAttribute('data-matricula-id', matriculaId);
    confirmarBtn.setAttribute('data-nuevo-estado', nuevoEstado);
  });

  // Manejar el clic en el botón de confirmación del modal
  confirmarBtn.addEventListener('click', async () => {
    const matriculaId = confirmarBtn.getAttribute('data-matricula-id');
    const nuevoEstado = confirmarBtn.getAttribute('data-nuevo-estado') === 'true'; // Convertir a booleano

    const originalButtonText = confirmarBtn.innerHTML;
    confirmarBtn.disabled = true;
    confirmarBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Procesando...`;

    try {
      const response = await fetch(`/api/matriculas/estado/${matriculaId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ activo: nuevoEstado }),
      });

      const result = await response.json();

      if (response.ok) {
        // Ocultar el modal
        const modal = bootstrap.Modal.getInstance(confirmarEstadoModal);
        modal.hide();

        // Mostrar alerta de éxito (asumiendo que tienes una función mostrarAlerta como en otros scripts)
        if (typeof mostrarAlerta === 'function') {
          mostrarAlerta(result.message, 'success');
        } else {
          alert(result.message); // Fallback
        }

        // Actualizar el botón en la tabla dinámicamente
        actualizarBotonDeEstado(activeButton, nuevoEstado);
      } else {
        if (typeof mostrarAlerta === 'function') {
          mostrarAlerta(result.message || 'Ocurrió un error.', 'danger');
        } else {
          alert(result.message || 'Ocurrió un error.'); // Fallback
        }
      }
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      if (typeof mostrarAlerta === 'function') {
        mostrarAlerta('No se pudo conectar con el servidor.', 'danger');
      } else {
        alert('No se pudo conectar con el servidor.'); // Fallback
      }
    } finally {
      // Restaurar el botón en el modal
      confirmarBtn.disabled = false;
      confirmarBtn.innerHTML = originalButtonText;
    }
  });

  function actualizarBotonDeEstado(button, esActivo) {
    const icon = button.querySelector('i');
    const texto = esActivo ? 'Dar de Baja' : 'Dar de Alta';
    const nuevaClase = esActivo ? 'btn-outline-danger' : 'btn-outline-success';
    const claseAntigua = esActivo ? 'btn-outline-success' : 'btn-outline-danger';

    button.classList.remove(claseAntigua);
    button.classList.add(nuevaClase);
    icon.className = esActivo ? 'bi bi-x-circle-fill me-2' : 'bi bi-check-circle-fill me-2';
    button.innerHTML = `${icon.outerHTML} ${texto}`;
    button.setAttribute('data-nuevo-estado', String(!esActivo));
    button.setAttribute('data-accion-texto', texto.toLowerCase());
    button.setAttribute('data-titulo', `Confirmar ${texto} de Matrícula`);
  }
});