document.addEventListener('DOMContentLoaded', function () {
  const confirmarEstadoModal = document.getElementById('confirmarEstadoModal');
  if (!confirmarEstadoModal) return;

  const modalTitle = document.getElementById('confirmarEstadoModalLabel');
  const modalBody = document.getElementById('confirmarEstadoModalBody');
  const confirmarBtn = document.getElementById('confirmarEstadoBtn');

  // Variable para mantener una referencia al botón que activó el modal
  let activeButton = null;

  // 1. Configurar el modal dinámicamente antes de que se muestre
  confirmarEstadoModal.addEventListener('show.bs.modal', function (event) {
    const button = event.relatedTarget; // El botón que activó el modal

    // Extraer datos del botón
    const usuarioId = button.getAttribute('data-usuario-id');
    activeButton = button; // Guardamos la referencia al botón
    const nuevoEstado = button.getAttribute('data-nuevo-estado');
    const accionTexto = button.getAttribute('data-accion-texto');
    const btnClase = button.getAttribute('data-btn-clase');
    const titulo = button.getAttribute('data-titulo');

    // Actualizar el contenido del modal
    modalTitle.textContent = titulo;
    modalBody.textContent = `¿Estás seguro de que deseas ${accionTexto} a este usuario?`;
    
    // Configurar el botón de confirmación
    confirmarBtn.textContent = `Sí, ${accionTexto}`;
    confirmarBtn.className = `btn ${btnClase}`; // Limpia clases anteriores y aplica la nueva

    // Guardar los datos en el botón de confirmación para usarlos en el evento click
    confirmarBtn.setAttribute('data-usuario-id', usuarioId);
    confirmarBtn.setAttribute('data-nuevo-estado', nuevoEstado);
  });

  // 2. Manejar el click en el botón de confirmación del modal
  confirmarBtn.addEventListener('click', async function () {
    const usuarioId = this.getAttribute('data-usuario-id');
    const nuevoEstado = this.getAttribute('data-nuevo-estado') === 'true'; // Convertir a booleano

    const originalButtonText = this.innerHTML;
    this.disabled = true;
    this.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Procesando...`;

    try {
      const response = await fetch(`/api/usuarios/estado/${usuarioId}`, {
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

        // Mostrar alerta de éxito
        mostrarAlerta(result.message, 'success');

        // En lugar de recargar, actualizamos el botón dinámicamente
        actualizarBotonDeEstado(activeButton, nuevoEstado);

      } else {
        mostrarAlerta(result.message || 'Ocurrió un error.', 'danger');
      }
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      mostrarAlerta('No se pudo conectar con el servidor.', 'danger');
    } finally {
      // Restaurar el botón en el modal
      this.disabled = false;
      this.innerHTML = originalButtonText;
    }
  });

  function actualizarBotonDeEstado(button, esActivo) {
    const icon = button.querySelector('i');
    if (esActivo) {
      // Cambiar a estado "Activo" (el botón ahora debe mostrar "Dar de Baja")
      button.classList.remove('btn-outline-success');
      button.classList.add('btn-outline-danger');
      icon.className = 'bi bi-person-x-fill me-2';
      button.innerHTML = `${icon.outerHTML} Dar de Baja`;
      button.setAttribute('data-nuevo-estado', 'false');
      button.setAttribute('data-accion-texto', 'dar de baja');
      button.setAttribute('data-titulo', 'Confirmar Baja de Usuario');
    } else {
      // Cambiar a estado "Inactivo" (el botón ahora debe mostrar "Dar de Alta")
      button.classList.remove('btn-outline-danger');
      button.classList.add('btn-outline-success');
      icon.className = 'bi bi-person-check-fill me-2';
      button.innerHTML = `${icon.outerHTML} Dar de Alta`;
      button.setAttribute('data-nuevo-estado', 'true');
      button.setAttribute('data-accion-texto', 'dar de alta');
      button.setAttribute('data-titulo', 'Confirmar Alta de Usuario');
    }
  }
});
