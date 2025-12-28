document.addEventListener('DOMContentLoaded', () => {
  const modalRegistrar = document.getElementById('modalHorario');
  if (!modalRegistrar) return;

  const form = document.getElementById('formCrearHorario');
  const errorContainer = document.getElementById('error-container-horario');
  const submitBtn = form.querySelector('button[type="submit"]');

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

    const horaInicio = document.getElementById('horaInicio').value;
    const horaFin = document.getElementById('horaFin').value;

    if (horaInicio && horaFin && horaFin <= horaInicio) {
      errorContainer.textContent = 'La hora de fin debe ser posterior a la hora de inicio.';
      errorContainer.classList.remove('d-none');
      return;
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Deshabilitar botón y mostrar spinner
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Guardando...';

    try {
      const response = await fetch('/api/horarios/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        let mensajeError = result.message || 'Ocurrió un error al registrar el horario.';
        if (result.errors && Array.isArray(result.errors)) {
            mensajeError = result.errors.map(e => e.msg).join(' ');
        }
        errorContainer.textContent = mensajeError;
        errorContainer.classList.remove('d-none');
        
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        return;
      }

      const bootstrapModal = bootstrap.Modal.getInstance(modalRegistrar);
      bootstrapModal.hide();
      mostrarAlerta('Horario registrado con éxito', 'success');

      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      errorContainer.textContent = 'Error de conexión. Por favor, inténtalo de nuevo.';
      errorContainer.classList.remove('d-none');
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });
});