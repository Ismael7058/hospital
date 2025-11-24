document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('formCambiarPassword');
  if (!form) return;

  // --- Funciones de ayuda ---
  // Se mueven aquí para que estén disponibles para todas las funciones de este script.
  const showError = (input, message) => {
    input.classList.add('is-invalid');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback d-block';
    errorDiv.textContent = message;
    input.parentNode.appendChild(errorDiv);
  };

  const clearErrors = () => {
    form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    form.querySelectorAll('.invalid-feedback').forEach(el => el.remove());
  };

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    clearErrors();
    if (validateFormCambiarPassword()) {
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
    submitButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Cambiando...`;
    
    const usuarioId = data.id;
    
    try {
      const response = await fetch(`/api/usuarios/editPassword/${usuarioId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();

      if (response.ok) { // Estado 200 OK
        mostrarAlerta('Contraseña actualizada exitosamente.', 'success');
        // Limpiamos los campos de contraseña después del éxito
        form.reset();
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
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;
    }
  }

  function validateFormCambiarPassword() {
    let isValid = true;

    // --- Obtener todos los campos ---
    const password = document.getElementById('password');
    const passwordConfirmation = document.getElementById('passwordConfirmation');


    // Password: mínimo 8 caracteres, con mayúscula, minúscula y número
    if (password.value.length < 8) {
      showError(password, 'La contraseña debe tener al menos 8 caracteres.');
      isValid = false;
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(password.value)) {
      showError(password, 'La contraseña debe contener al menos una mayúscula, una minúscula y un número.');
      isValid = false;
    }

    // Confirmar Password: debe coincidir con la contraseña
    if (passwordConfirmation.value === '') {
        showError(passwordConfirmation, 'Por favor, confirme la contraseña.');
        isValid = false;
    } else if (passwordConfirmation.value !== password.value) {
      showError(passwordConfirmation, 'Las contraseñas no coinciden.');
      isValid = false;
    }

    return isValid;
  }});
