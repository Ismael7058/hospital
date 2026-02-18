document.addEventListener('DOMContentLoaded', () => {
  const modalEvolucionMedica = document.getElementById('modalEvolucionMedica');
  if (!modalEvolucionMedica) return;

  const form = document.getElementById('formEvolucionMedica');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Procesando...';

    try {
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      const response = await fetch('/api/evoluciones-medicas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        const modalInstance = bootstrap.Modal.getInstance(modalEvolucionMedica);
        modalInstance.hide();

        mostrarAlerta(result.message || 'Estudio solicitado realizado registrada con éxito', 'success');

        setTimeout(() => {window.location.reload();}, 1000);
      } else {
        let mensajeError = result.message || 'Error al registrar el estudio solicitado';
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

  modalEvolucionMedica.addEventListener('hidden.bs.modal', () => {
    form.reset();
  });
});
