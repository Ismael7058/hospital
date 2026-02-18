document.addEventListener('DOMContentLoaded', () => {
  const modalEstudiosSolicitados = document.getElementById('modalEstudiosSolicitados');
  if (!modalEstudiosSolicitados) return;

  const form = document.getElementById('formEstudiosSolicitados');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Procesando...';

    try {
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      const response = await fetch('/api/estudios-solicitados', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        const modalInstance = bootstrap.Modal.getInstance(modalEstudiosSolicitados);
        modalInstance.hide();

        mostrarAlerta(result.message || 'Cuidado realizado registrada con éxito', 'success');

        setTimeout(() => {window.location.reload();}, 1000);
      } else {
        let mensajeError = result.message || 'Error al registrar el cuidado realizado';
        if (result.errors && Array.isArray(result.errors)) {
          mensajeError = result.errors.map(e => e.msg).join('. ');
        }
        mostrarAlerta(mensajeError, 'danger');
      }
    } catch (error) {
      console.error('Error:', error);
      mostrarAlerta(error.message ||'Error de conexión con el servidor.', 'danger');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });

  modalEstudiosSolicitados.addEventListener('hidden.bs.modal', () => {
    form.reset();
  });
});
