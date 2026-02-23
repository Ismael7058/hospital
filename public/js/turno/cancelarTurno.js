  const cancelarTurnoModal = document.getElementById('cancelarTurnoModal');
  if (cancelarTurnoModal) {
    cancelarTurnoModal.addEventListener('show.bs.modal', event => {
      const button = event.relatedTarget;
      const id = button.getAttribute('data-id');

      const confirmBtn = document.getElementById('btnCancelarTurno');
      
      const newBtn = confirmBtn.cloneNode(true);
      confirmBtn.parentNode.replaceChild(newBtn, confirmBtn);

      newBtn.addEventListener('click', async () => {
        const originalText = newBtn.innerHTML;
        newBtn.disabled = true;
        newBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Procesando...';

        try {
          const response = await fetch(`/api/turnos/${id}/estado`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: 'Cancelado' })
          });

          const result = await response.json();

          if (response.ok) {
            mostrarAlerta(result.message, 'success');
            setTimeout(() => window.location.reload(), 1000);
          } else {
            mostrarAlerta(result.message , 'warning');
            newBtn.disabled = false;
            newBtn.innerHTML = originalText;
          }
        } catch (error) {
          console.error(error);
          mostrarAlerta('Error de conexión.','danger');
          newBtn.disabled = false;
          newBtn.innerHTML = originalText;
        }
      });
    });
  }