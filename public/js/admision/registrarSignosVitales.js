document.addEventListener('DOMContentLoaded', () => {
  const modalSignosVitales = document.getElementById('modalSignosVitales');
  if (!modalSignosVitales) return;

  const form = document.getElementById('formSignosVitales');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Procesando...';

    try {
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      const response = await fetch('/api/signos-vitales', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        const modalInstance = bootstrap.Modal.getInstance(modalSignosVitales);
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

  modalSignosVitales.addEventListener('hidden.bs.modal', () => {
    form.reset();
  });
});
