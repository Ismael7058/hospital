document.addEventListener('DOMContentLoaded', () => {
  const modalRegistrar = document.getElementById('modalRegistrarEspecialidad');
  if (!modalRegistrar) return;

  const form = document.getElementById('formRegistrarEspecialidad');
  const errorContainer = document.getElementById('error-container-especialidad');

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

    // Limpiar errores previos
    errorContainer.classList.add('d-none');
    errorContainer.textContent = '';
    form.classList.remove('was-validated');

    // Validar formulario con Bootstrap
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/especialidades/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        errorContainer.textContent = result.message || 'Ocurrió un error al registrar la especialidad.';
        errorContainer.classList.remove('d-none');
        return;
      }

      // Si el registro es exitoso
      const bootstrapModal = bootstrap.Modal.getInstance(modalRegistrar);
      bootstrapModal.hide();
      mostrarAlerta('Especialidad registrada con éxito', 'success');

      window.location.href = '/especialidades';
    } catch (error) {
      errorContainer.textContent = 'Error de conexión. Por favor, inténtalo de nuevo.';
      errorContainer.classList.remove('d-none');
    }
  });
});