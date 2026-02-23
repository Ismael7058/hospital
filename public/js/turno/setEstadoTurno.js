const confirmarEstadoModal = document.getElementById('confirmarEstadoModal');
if (confirmarEstadoModal) {
  confirmarEstadoModal.addEventListener('show.bs.modal', event => {
    const button = event.relatedTarget;
    const id = button.getAttribute('data-id');
    const activo = button.getAttribute('data-activo') === 'true';
    const accion = button.getAttribute('data-accion');
    const clase = button.getAttribute('data-clase');

    const modalBody = confirmarEstadoModal.querySelector('.modal-body p');
    if (modalBody) modalBody.textContent = `¿Está seguro de que desea ${accion} este turno?`;

    const confirmBtn = document.getElementById('btnConfirmarEstado');

    confirmBtn.className = 'btn';
    if (clase) confirmBtn.classList.add(clase);
    const newBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newBtn, confirmBtn);

    newBtn.addEventListener('click', async () => {
      const originalText = newBtn.innerHTML;
      newBtn.disabled = true;
      newBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Procesando...';

      try {
        const response = await fetch(`/api/turnos/${id}/activo`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ activo })
        });

        const result = await response.json();

        if (response.ok) {
          mostrarAlerta(result.message, 'success');
          setTimeout(() => window.location.reload(), 1000);
        } else {
          mostrarAlerta(result.message, 'warning');
          newBtn.disabled = false;
          newBtn.innerHTML = originalText;
        }
      } catch (error) {
        console.error(error);
        mostrarAlerta('Error de conexión.', 'danger');
        newBtn.disabled = false;
        newBtn.innerHTML = originalText;
      }
    });
  });
}