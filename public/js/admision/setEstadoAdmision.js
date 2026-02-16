document.addEventListener('DOMContentLoaded', () => {
  const modalEstado = document.getElementById('modalEstadoAdmision');
  const formEstadoAdmision = document.getElementById('formEstadoAdmision');
  if (modalEstado && formEstadoAdmision) {
    modalEstado.addEventListener('show.bs.modal', function (event) {
      const button = event.relatedTarget;
      
      const titulo = button.getAttribute('data-titulo');
      const mensaje = button.getAttribute('data-mensaje');
      const estado = button.getAttribute('data-estado');
      const claseBtn = button.getAttribute('data-clase');
      const admisionId = button.getAttribute('data-id');

      modalEstado.querySelector('.modal-title').textContent = titulo;
      modalEstado.querySelector('#mensajeEstadoAdmision').textContent = mensaje;
      modalEstado.querySelector('#inputEstadoAdmisionId').value = admisionId;
      modalEstado.querySelector('#inputEstadoAdmisionAccion').value = estado;
      
      const btnConfirmar = modalEstado.querySelector('#btnConfirmarEstadoAdmision');
      btnConfirmar.className = 'btn ' + claseBtn;
    });

    formEstadoAdmision.addEventListener('submit', async function (event) {
      event.preventDefault();

      const btnConfirmar = this.querySelector('#btnConfirmarEstadoAdmision');
      const originalButtonText = btnConfirmar.innerHTML;
      btnConfirmar.disabled = true;
      btnConfirmar.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Procesando...`;

      const admisionId = this.querySelector('#inputEstadoAdmisionId').value;
      const estado = this.querySelector('#inputEstadoAdmisionAccion').value;

      try {
        const response = await fetch(`/api/admisiones/${admisionId}/estado`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ estado: estado }),
        });

        const result = await response.json();
        const bootstrapModal = bootstrap.Modal.getInstance(modalEstado);
        bootstrapModal.hide();

        if (response.ok) {
          mostrarAlerta(result.message, 'success');
          setTimeout(() => window.location.reload(), 1000);
        } else {
          mostrarAlerta(result.message || 'Ocurrió un error al cambiar el estado.', 'danger');
          setTimeout(() => window.location.reload(), 1000);
        }
      } catch (error) {
        console.error('Error al cambiar estado de admisión:', error);
        mostrarAlerta('No se pudo conectar con el servidor.', 'danger');
      } finally {
        btnConfirmar.disabled = false;
        btnConfirmar.innerHTML = originalButtonText;
      }
    });
  }
});