document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('registroForm');
  if (!form) return; // Salir si el formulario no está en la página actual

  form.addEventListener('submit', function (event) {
    // Siempre prevenimos el envío tradicional del formulario
    event.preventDefault();

    // Primero, validamos en el cliente
    if (validateForm()) {
      // Si la validación del cliente es exitosa, enviamos los datos a la API
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

    try {
      const response = await fetch('/api/usuarios/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) { // Esto cubre estados 2xx, incluyendo 201
        // --- Manejo de Éxito (201 Created) ---
        // Redirigir a la página de gestión del usuario recién creado.
        // Asumimos que la ruta es /usuarios/:id
        if (result.usuarioId) {
          window.location.href = `/usuarios/${result.usuarioId}`;
        } else {
          window.location.href = '/usuarios/register'; // Fallback por si el ID no viene
        }
      } else {
        // --- Manejo de Errores (4xx, 5xx) ---
        if (response.status === 400) {
          // Error de validación del servidor (express-validator)
          // Aunque ya validamos en cliente, es una buena segunda capa.
          result.errors.forEach(error => {
            const input = document.getElementById(error.path);
            if (input) {
              showError(input, error.msg);
            }
          });
        } else if (response.status === 409) {
          // Error de conflicto (DNI o email duplicado)
          generalErrorDiv.textContent = result.message;
          generalErrorDiv.classList.remove('d-none');
        } else {
          // Otros errores del servidor (ej. 500)
          generalErrorDiv.textContent = result.message || 'Ocurrió un error inesperado en el servidor.';
          generalErrorDiv.classList.remove('d-none');
        }
      }
    } catch (error) {
      // --- Manejo de Errores de Red ---
      generalErrorDiv.textContent = 'No se pudo conectar con el servidor. Por favor, revise su conexión a internet.';
      generalErrorDiv.classList.remove('d-none');
      console.error('Error de red al enviar el formulario:', error);
    } finally {
      // Restaurar el botón
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;
    }
  }

  function validateForm() {
    let isValid = true;

    // --- Funciones de ayuda ---
    const clearErrors = () => {
      document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
      document.querySelectorAll('.invalid-feedback').forEach(el => el.remove());
      // También limpiamos los errores del backend que se renderizaron inicialmente
      document.querySelectorAll('.text-danger.mt-1.small').forEach(el => el.remove());
      // Ocultar el div de error general
      const generalErrorDiv = document.getElementById('general-error');
      if(generalErrorDiv) generalErrorDiv.classList.add('d-none');
    };

    const showError = (input, message) => {
      input.classList.add('is-invalid');
      const errorDiv = document.createElement('div');
      errorDiv.className = 'invalid-feedback d-block'; // Usamos la clase de Bootstrap
      errorDiv.textContent = message;
      input.parentNode.appendChild(errorDiv);
      isValid = false;
    };

    // Limpiar errores previos antes de una nueva validación
    clearErrors();

    // --- Obtener todos los campos ---
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const passwordConfirmation = document.getElementById('passwordConfirmation');
    const nombre = document.getElementById('nombre');
    const apellido = document.getElementById('apellido');
    const dni = document.getElementById('dni');
    const fechaNacimiento = document.getElementById('fecha_nacimiento');
    const telefono = document.getElementById('telefono');
    const sexo = document.getElementById('sexo');
    const rolId = document.getElementById('rol_id');
    // El rol_id no se valida en el cliente ya que requiere una consulta a la BD.

    // --- Reglas de Validación ---

    // Nombre: no vacío y solo letras/espacios
    if (nombre.value.trim() === '') {
      showError(nombre, 'El nombre es obligatorio.');
    } else if (!/^[a-zA-Z\u00C0-\u017F\s'-]+$/.test(nombre.value)) {
      showError(nombre, 'El nombre solo debe contener letras y espacios.');
    }

    // Apellido: no vacío y solo letras/espacios
    if (apellido.value.trim() === '') {
      showError(apellido, 'El apellido es obligatorio.');
    } else if (!/^[a-zA-Z\u00C0-\u017F\s'-]+$/.test(apellido.value)) {
      showError(apellido, 'El apellido solo debe contener letras y espacios.');
    }

    // DNI: no vacío, 8 dígitos y solo números
    if (dni.value.trim() === '') {
      showError(dni, 'El DNI es obligatorio.');
    } else if (!/^\d{8}$/.test(dni.value)) {
      showError(dni, 'El DNI debe tener 8 dígitos.');
    }

    // Fecha de Nacimiento: no vacío
    if (fechaNacimiento.value === '') {
      showError(fechaNacimiento, 'La fecha de nacimiento es obligatoria.');
    }

    // Sexo: no vacío
    if (sexo.value === '') {
      showError(sexo, 'Debe seleccionar un sexo.');
    }

    // Rol: no vacío
    if (rolId.value === '') {
      showError(rolId, 'Debe seleccionar un rol para el usuario.');
    }

    // Teléfono: no vacío
    if (telefono.value.trim() === '') {
      showError(telefono, 'El teléfono es obligatorio.');
    }

    // Email: no vacío y formato válido
    if (email.value.trim() === '') {
      showError(email, 'El correo electrónico es obligatorio.');
    } else if (!/^\S+@\S+\.\S+$/.test(email.value)) {
      showError(email, 'Por favor, ingrese un email válido.');
    }

    // Password: mínimo 8 caracteres, con mayúscula, minúscula y número
    if (password.value.length < 8) {
      showError(password, 'La contraseña debe tener al menos 8 caracteres.');
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(password.value)) {
      showError(password, 'La contraseña debe contener al menos una mayúscula, una minúscula y un número.');
    }

    // Confirmar Password: debe coincidir con la contraseña
    if (passwordConfirmation.value === '') {
        showError(passwordConfirmation, 'Por favor, confirme la contraseña.');
    } else if (passwordConfirmation.value !== password.value) {
      showError(passwordConfirmation, 'Las contraseñas no coinciden.');
    }

    return isValid;
  }
});
