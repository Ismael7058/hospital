document.addEventListener('DOMContentLoaded', () => {
  const modalMedicacionActiva = document.getElementById('modalMedicacionActiva');
  if (!modalMedicacionActiva) return;

  const form = document.getElementById('formMedicacionActiva');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Procesando...';

    try {
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      const dosisInput = document.getElementById('dosis');
      const unidadSelect = dosisInput.nextElementSibling;
      if (dosisInput && unidadSelect) {
        data.dosis = `${dosisInput.value} ${unidadSelect.value}`;
      }

      const response = await fetch('/api/medicaciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        const modalInstance = bootstrap.Modal.getInstance(modalMedicacionActiva);
        modalInstance.hide();

        mostrarAlerta(result.message || 'Medicación registrada con éxito', 'success');

        setTimeout(() => {window.location.reload();}, 1000);
      } else {
        let mensajeError = result.message || 'Error al registrar la medicación';
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

  modalMedicacionActiva.addEventListener('hidden.bs.modal', () => {
    form.reset();
  });
});
