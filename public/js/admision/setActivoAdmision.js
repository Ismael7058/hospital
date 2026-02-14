document.addEventListener('DOMContentLoaded', () => {
  const modalEstado = document.getElementById('confirmarEstadoModal');
  if (!modalEstado) return;

  const confirmarBtn = document.getElementById('btnConfirmarEstadoAdmision');
  const modalTitle = modalEstado.querySelector('.modal-title');
  const modalBody = modalEstado.querySelector('#mensajeEstadoAdmision');

  let activeButton = null;

  modalEstado.addEventListener('show.bs.modal', function (event) {
    const button = event.relatedTarget;
    activeButton = button;

    const titulo = button.getAttribute('data-titulo') || 'Confirmar Acción';
    const mensaje = button.getAttribute('data-mensaje') || '¿Está seguro de realizar esta acción?';
    const claseBtn = button.getAttribute('data-clase') || 'btn-primary';
    const id = button.getAttribute('data-id');
    const activo = button.getAttribute('data-activo');

    if (modalTitle) modalTitle.textContent = titulo;
    if (modalBody) modalBody.textContent = mensaje;

    confirmarBtn.className = 'btn ' + claseBtn;
    confirmarBtn.setAttribute('data-admision-id', id);
    confirmarBtn.setAttribute('data-activo', activo);
  });

  confirmarBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const admisionId = confirmarBtn.getAttribute('data-admision-id');
    const nuevoEstado = confirmarBtn.getAttribute('data-activo') === 'true'; 

    const originalButtonText = confirmarBtn.innerHTML;
    confirmarBtn.disabled = true;
    confirmarBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Procesando...`;

    try {
      const response = await fetch(`/api/admisiones/${admisionId}/activo`, {
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
    if (!button) return;
    const icon = button.querySelector('i');
    const texto = esActivo ? 'Dar de Baja' : 'Dar de Alta';
    const nuevaClase = esActivo ? 'btn-outline-danger' : 'btn-outline-success';
    const claseAntigua = esActivo ? 'btn-outline-success' : 'btn-outline-danger';

    button.classList.remove(claseAntigua);
    button.classList.add(nuevaClase);
    
    if (icon) {
      icon.className = esActivo ? 'bi bi-eye-slash-fill me-2' : 'bi bi-eye-fill me-2';
    }
    
    button.innerHTML = '';
    if (icon) button.appendChild(icon);
    button.appendChild(document.createTextNode(texto));

    button.setAttribute('data-nuevo-estado', String(!esActivo));
    button.setAttribute('data-accion-texto', texto.toLowerCase());
    button.setAttribute('data-activo', String(!esActivo));
    button.setAttribute('data-clase', esActivo ? 'btn-warning' : 'btn-success');
    button.setAttribute('data-titulo', esActivo ? 'Dar de Baja' : 'Dar de Alta');
    button.setAttribute('data-mensaje', `¿Confirma que desea ${texto.toLowerCase()} la admisión?`);
  }
});