document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;

  const loginModal = document.getElementById('loginModal');
  const emailInput = document.getElementById('emailInput');
  const passwordInput = document.getElementById('passwordInput');
  const errorDiv = document.getElementById('loginError');
  const submitButton = loginForm.querySelector('button[type="submit"]');

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearErrors();

    if (!validateInputs()) {
      return;
    }

    const originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Verificando...`;

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailInput.value,
          password: passwordInput.value,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Éxito: el servidor ya estableció la cookie httpOnly.
        // Ahora redirigimos al cliente a la página principal.
        window.location.href = '/';
      } else {
        // Error: mostramos el mensaje del servidor en el div de error.
        errorDiv.textContent = result.message || 'Ocurrió un error inesperado.';
        errorDiv.classList.remove('d-none');
      }
    } catch (error) {
      errorDiv.textContent = 'No se pudo conectar con el servidor.';
      errorDiv.classList.remove('d-none');
      console.error('Error de red al iniciar sesión:', error);
    } finally {
      // Restaurar el botón
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;
    }
  });

  // Limpiar errores cuando el modal se cierra
  loginModal.addEventListener('hidden.bs.modal', () => {
    clearErrors();
    loginForm.reset();
  });

  function validateInputs() {
    let isValid = true;
    if (emailInput.value.trim() === '') {
      showError(emailInput, 'El correo electrónico es obligatorio.');
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(emailInput.value)) {
      showError(emailInput, 'Por favor, ingrese un email válido.');
      isValid = false;
    }

    if (passwordInput.value.trim() === '') {
      showError(passwordInput, 'La contraseña es obligatoria.');
      isValid = false;
    }
    return isValid;
  }

  function showError(input, message) {
    input.classList.add('is-invalid');
    const feedback = document.createElement('div');
    feedback.className = 'invalid-feedback';
    feedback.textContent = message;
    input.parentNode.appendChild(feedback);
  }

  function clearErrors() {
    errorDiv.classList.add('d-none');
    errorDiv.textContent = '';
    document.querySelectorAll('.is-invalid').forEach((el) => el.classList.remove('is-invalid'));
    document.querySelectorAll('.invalid-feedback').forEach((el) => el.remove());
  }
});
