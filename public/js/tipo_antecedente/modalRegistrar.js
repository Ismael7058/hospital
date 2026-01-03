document.addEventListener('DOMContentLoaded', () => {
  const modalRegistrar = document.getElementById('modalRegistrarTipoAntecedente');
  if (!modalRegistrar) return;

  const form = document.getElementById('formRegistrarTipoAntecedente');
  const errorContainer = document.getElementById('error-container-tipo-antecedente');

  // Limpiar el formulario y los errores cuando el modal se oculta
  modalRegistrar.addEventListener('hidden.bs.modal', () => {
    form.reset();
    form.classList.remove('was-validated');
    errorContainer.classList.add('d-none');
    errorContainer.textContent = '';
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    event.stopPropagation();

    errorContainer.classList.add('d-none');
    errorContainer.textContent = '';
    form.classList.remove('was-validated');

    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/tipo-antecedente/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        errorContainer.textContent = result.message || 'Ocurrió un error al registrar el tipo de antecedente';
        errorContainer.classList.remove('d-none');
        return;
      }

      const bootstrapModal = bootstrap.Modal.getInstance(modalRegistrar);
      bootstrapModal.hide();
      mostrarAlerta('Tipo de antecedente registrado con éxito', 'success');

      window.location.href = '/tipos-antecedentes';
    } catch (error) {
      errorContainer.textContent = 'Error de conexión. Por favor, inténtalo de nuevo.';
      errorContainer.classList.remove('d-none');
    }
  });
});