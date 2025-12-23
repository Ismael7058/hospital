document.addEventListener('DOMContentLoaded', () => {
  const modalRegistrar = document.getElementById('modalRegistrarPacienteSeguro');
  if (!modalRegistrar) return;

  const form = document.getElementById('formRegistrarPacienteSeguro');
  const errorContainer = document.getElementById('error-container-registrar');

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
    form.classList.remove('was-validated');

    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/paciente-seguros/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message || 'Error al registrar.');

      window.location.reload(); 
    } catch (error) {
      errorContainer.textContent = error.message;
      errorContainer.classList.remove('d-none');
    }
  });
});
