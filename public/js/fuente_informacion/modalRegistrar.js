document.addEventListener('DOMContentLoaded', () => {
  const modalRegistrar = document.getElementById('modalRegistrarFuenteInformacion');
  if (!modalRegistrar) return;

  const form = document.getElementById('formRegistrarFuenteInformacion');
  const errorContainer = document.getElementById('error-container-fuente-informacion');

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
      const response = await fetch('/api/fuentes/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        errorContainer.textContent = result.message || 'Ocurrió un error al registrar la fuente de informacion';
        errorContainer.classList.remove('d-none');
        return;
      }

      const bootstrapModal = bootstrap.Modal.getInstance(modalRegistrar);
      bootstrapModal.hide();
      mostrarAlerta('Fuente de informacion registrado con éxito', 'success');

      window.location.href = '/funtes-informacion';
    } catch (error) {
      errorContainer.textContent = 'Error de conexión. Por favor, inténtalo de nuevo.';
      errorContainer.classList.remove('d-none');
    }
  });
});