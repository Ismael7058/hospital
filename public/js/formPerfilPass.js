import { showError } from './utils.js';

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('formPerfilPassword');
  if (!form) return;

  const clearErrors = () => {
    form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    form.querySelectorAll('.invalid-feedback').forEach(el => el.remove());
  };

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    clearErrors();

    if (validateFormPerfilPassword()) {
      submitFormToApi();
    }
  });

  async function submitFormToApi() {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    let shouldRestoreButtonInFinally = true; // Flag para controlar la restauración del botón

    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Cambiando...`;


    try {
      const response = await fetch(`/api/usuarios/editPassword`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) { // Estado 200 OK
        // 1. Usar la alerta global para el mensaje de éxito
        mostrarAlerta('Contraseña actualizada correctamente.', 'success');
        // 2. Restaurar el botón
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
        // 3. Limpiar el formulario (después de restaurar el botón)
        form.reset();
        shouldRestoreButtonInFinally = false;

      } else {
        if (response.status === 400) {
          result.errors.forEach(error => {
            // Buscamos el input con el prefijo 'perfil_'
            const input = document.getElementById('perfil_' + error.path);
            if (input) {
              showError(input, error.msg);
            }
          });
        } else if (response.status === 401) {
          // Contraseña anterior incorrecta
          mostrarAlerta(result.message, 'danger');
        } else {
          mostrarAlerta(result.message || 'Ocurrió un error inesperado.', 'danger');
        }
      }
    } catch (error) {
      mostrarAlerta('No se pudo conectar con el servidor. Por favor, revise su conexión a internet.', 'danger');
      console.error('Error de red al enviar el formulario:', error);
    } finally {
      // Restaurar el botón si no se manejó en el bloque de éxito.
      if (shouldRestoreButtonInFinally) {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
      }
    }
  }

  function validateFormPerfilPassword() {
    let isValid = true;

    // --- Obtener todos los campos ---
    const passwordAnterior = document.getElementById('perfil_passwordAnterior');
    const password = document.getElementById('perfil_password');
    const passwordConfirmation = document.getElementById('perfil_passwordConfirmation');

    // Contraseña Actual: no debe estar vacía
    if (passwordAnterior.value.trim() === '') {
      showError(passwordAnterior, 'La contraseña actual es obligatoria.');
      isValid = false;
    }

    // Nueva Contraseña: mínimo 8 caracteres, con mayúscula, minúscula y número
    if (password.value.length < 8) {
      showError(password, 'La nueva contraseña debe tener al menos 8 caracteres.');
      isValid = false;
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(password.value)) {
      showError(password, 'Debe contener al menos una mayúscula, una minúscula y un número.');
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
  }
});
