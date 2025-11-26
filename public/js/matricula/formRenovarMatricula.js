document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formRenovarMatricula');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    if (validateForm()) {
      submitFormToApi();
    }
  });

  async function submitFormToApi() {
    const matriculaId = form.querySelector('input[name="id"]').value;
    const fecha_vencimiento = document.getElementById('fecha_vencimiento').value;
    const generalErrorDiv = document.getElementById('general-error');
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;

    submitButton.disabled = true;
    submitButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Guardando...`;

    try {
      const response = await fetch(`/api/matriculas/update/${matriculaId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fecha_vencimiento }),
      });

      const result = await response.json();

      if (response.ok) {
        mostrarAlerta('Matrícula actualizada exitosamente.', 'success');
      } else {
        if (response.status === 400 && result.errors) {
          result.errors.forEach(error => {
            showError(error.path, error.msg);
          });
        } else {
          generalErrorDiv.textContent = result.message || 'Ocurrió un error inesperado.';
          generalErrorDiv.classList.remove('d-none');
        }
      }
    } catch (error) {
      console.error('Error en el envío del formulario:', error);
      generalErrorDiv.textContent = 'No se pudo conectar con el servidor. Por favor, revise su conexión.';
      generalErrorDiv.classList.remove('d-none');
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;
    }
  }

  function validateForm() {
    let isValid = true;
    const fecha_vencimientoInput = document.getElementById('fecha_vencimiento');

    if (!fecha_vencimientoInput.value) {
      showError('fecha_vencimiento', 'La fecha de vencimiento es obligatoria.');
      isValid = false;
    }
    return isValid;
  }

  const showError = (field, message) => {
    const fieldElement = document.getElementById(field);
    const errorElement = document.getElementById(`error-${field}`);

    if (fieldElement) {
      fieldElement.classList.add('is-invalid');
    }
  };

  const clearErrors = () => {
    document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    document.querySelectorAll('.invalid-feedback').forEach(el => el.textContent = '');
    document.getElementById('general-error')?.classList.add('d-none');
  };
});