
import { showError } from './utils.js';

document.addEventListener('DOMContentLoaded', function () {
  const clearErrors = () => {
    const form = document.getElementById('formPerfilInformacion');
    if (!form) return;
    form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    form.querySelectorAll('.invalid-feedback').forEach(el => el.remove());
  };

  const form = document.getElementById('formPerfilInformacion');
  if (!form) return;

  form.addEventListener('submit', function (event) {

    event.preventDefault();
    // Limpiamos errores antiguos y validamos
    clearErrors();
    const isValid = validateFormPerfilInformacion();
    if (isValid) {
      submitFormToApi(form);
    }
  });

  async function submitFormToApi(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Cambiando...`;


    try {
      const response = await fetch(`/api/usuarios/editPerfil`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) { // Estado 200 OK
        mostrarAlerta('Información actualizada exitosamente.', 'success');

        // Actualizamos el nombre del usuario en la UI dinámicamente
        const nuevoNombreCompleto = `${data.nombre} ${data.apellido}`;

        // Actualizar el header principal
        const headerUserName = document.querySelector('.navbar-text');
        if (headerUserName) headerUserName.textContent = nuevoNombreCompleto;

        // Actualizar el sidebar del modal
        const modalSidebarUserName = document.querySelector('#perfilUsuarioModal .text-center h6');
        if (modalSidebarUserName) modalSidebarUserName.textContent = nuevoNombreCompleto;
      } else {
        if (response.status === 400) {
          result.errors.forEach(error => {
            // Buscamos el input con el prefijo 'perfil_'
            const input = document.getElementById('perfil_' + error.path);
            if (input) {
              showError(input, error.msg);
            }
          });
        } else {
          mostrarAlerta(result.message || 'Ocurrió un error inesperado.', 'danger');
        }
      }
    } catch (error) {
      mostrarAlerta('No se pudo conectar con el servidor. Por favor, revise su conexión a internet.', 'danger');
      console.error('Error de red al enviar el formulario:', error);
    } finally {
      // Restaurar el botón después de un breve retraso para evitar clics múltiples
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;
    }
  }

  function validateFormPerfilInformacion() {
    let isValid = true; // Se reinicia en cada validación

    // --- Obtener todos los campos ---
    const nombre = document.getElementById('perfil_nombre');
    const apellido = document.getElementById('perfil_apellido');
    const telefono = document.getElementById('perfil_telefono');
    const direccion = document.getElementById('perfil_direccion');
    const fechaNacimiento = document.getElementById('perfil_fecha_nacimiento');

    // Nombre: no vacío y solo letras/espacios
    if (nombre.value.trim() === '') {
      showError(nombre, 'El nombre es obligatorio.');
      isValid = false;
    }

    // Apellido: no vacío y solo letras/espacios
    if (apellido.value.trim() === '') {
      showError(apellido, 'El apellido es obligatorio.');
      isValid = false;
    }

    // Fecha de Nacimiento: no vacío
    if (fechaNacimiento.value === '') {
      showError(fechaNacimiento, 'La fecha de nacimiento es obligatoria.');
      isValid = false;
    }

    // Teléfono: no vacío
    if (telefono.value.trim() === '') {
      showError(telefono, 'El teléfono es obligatorio.');
      isValid = false;
    }

    // Direccion: no vacío y debe tener mas de 6 caracters
    if (direccion.value.trim() === '') {
      showError(direccion, 'La dirección es obligatoria.');
      isValid = false;
    } else if (direccion.value.length < 6) {
      showError(direccion, 'La dirección debe tener al menos 6 caracteres.');
      isValid = false;
    }
    return isValid;
  }
});
