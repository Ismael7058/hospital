document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('formAdministracion');
  if (!form) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    if (validateFormAdministracion()) {

      submitFormToApi();
    }
  });

  async function submitFormToApi() {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const generalErrorDiv = document.getElementById('general-error');

    // Ocultar errores previos y mostrar un estado de "cargando"
    generalErrorDiv.classList.add('d-none');
    generalErrorDiv.textContent = '';
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Registrando...`;
    
    const usuarioId = data.id;
    
    try {
      const response = await fetch(`/api/usuarios/editCuenta/${usuarioId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();

      if (response.ok) { // Estado 200 OK
        mostrarAlerta('Información personal actualizada exitosamente.', 'success');
      } else {
        if (response.status === 400) {
          result.errors.forEach(error => {
            const input = document.getElementById(error.path);
            if (input) {
              showError(input, error.msg);
            }
          });
        } else if (response.status === 409) {
          // Error de conflicto (email duplicado)
          generalErrorDiv.textContent = result.message;
          generalErrorDiv.classList.remove('d-none');
        } else {
          generalErrorDiv.textContent = result.message || 'Ocurrió un error inesperado en el servidor.';
          generalErrorDiv.classList.remove('d-none');
        }
      }
    } catch (error) {
      generalErrorDiv.textContent = 'No se pudo conectar con el servidor. Por favor, revise su conexión a internet.';
      generalErrorDiv.classList.remove('d-none');
      console.error('Error de red al enviar el formulario:', error);
    } finally {
      // Restaurar el botón
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;
    }
  }

  function validateFormAdministracion() {
    let isValid = true;

    // --- Funciones de ayuda ---
    const clearErrors = () => {
      document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
      document.querySelectorAll('.invalid-feedback').forEach(el => el.remove());

      document.querySelectorAll('.text-danger.mt-1.small').forEach(el => el.remove());

      const generalErrorDiv = document.getElementById('general-error');
      if(generalErrorDiv) generalErrorDiv.classList.add('d-none');
    };

    const showError = (input, message) => {
      input.classList.add('is-invalid');
      const errorDiv = document.createElement('div');
      errorDiv.className = 'invalid-feedback d-block';
      errorDiv.textContent = message;
      input.parentNode.appendChild(errorDiv);
      isValid = false;
    };

    clearErrors();

    // --- Obtener todos los campos ---
    const email = document.getElementById('email');
    const rolId = document.getElementById('rol_id');


    // Email: no vacío y formato válido
    if (email.value.trim() === '') {
      showError(email, 'El correo electrónico es obligatorio.');
    } else if (!/^\S+@\S+\.\S+$/.test(email.value)) {
      showError(email, 'Por favor, ingrese un email válido.');
    }

    // Rol: no vacío
    if (rolId.value === '') {
      showError(rolId, 'Debe seleccionar un rol para el usuario.');
    }

    return isValid;
  }
});