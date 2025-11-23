document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('formInformacionPersonal');
  if (!form) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    if (validateFormInformacionPersonal()) {

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
      const response = await fetch(`/api/usuarios/infoPersonal/${usuarioId}`, {
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
          // Error de conflicto (DNI duplicado)
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

  function validateFormInformacionPersonal() {
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
    const dni = document.getElementById('dni');
    const nombre = document.getElementById('nombre');
    const apellido = document.getElementById('apellido');
    const fechaNacimiento = document.getElementById('fecha_nacimiento');
    const sexo = document.getElementById('sexo');
    const telefono = document.getElementById('telefono');
    const direccion = document.getElementById('direccion');

    // DNI: no vacío, 8 dígitos y solo números
    if (dni.value.trim() === '') {
      showError(dni, 'El DNI es obligatorio.');
    } else if (!/^\d{8}$/.test(dni.value)) {
      showError(dni, 'El DNI debe tener 8 dígitos.');
    }

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

    // Fecha de Nacimiento: no vacío
    if (fechaNacimiento.value === '') {
      showError(fechaNacimiento, 'La fecha de nacimiento es obligatoria.');
    }

    // Sexo: no vacío
    if (sexo.value === '') {
      showError(sexo, 'Debe seleccionar un sexo.');
    }

    // Teléfono: no vacío
    if (telefono.value.trim() === '') {
      showError(telefono, 'El teléfono es obligatorio.');
    }

    // Direccion: no vacío y debe tener mas de 6 caracters
    if (direccion.value.trim() === '' ) {
        showError(direccion, 'La dirección es obligatoria.');
    } else if ( direccion.value.length < 6) {
        showError(direccion, 'La dirección debe tener al menos 6 caracteres.');
    }

    return isValid;
  }
});