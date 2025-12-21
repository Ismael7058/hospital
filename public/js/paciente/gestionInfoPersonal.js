document.addEventListener('DOMContentLoaded', function () {
  // --- LÓGICA PARA TAGIFY (NACIONALIDADES) ---
  const nacionalidadesInput = document.querySelector('#nacionalidades-input');
  if (nacionalidadesInput) {
    // Inicializar Tagify
    const tagify = new Tagify(nacionalidadesInput, {
      whitelist: typeof nacionalidadesWhitelist !== 'undefined' ? nacionalidadesWhitelist : [],
      tagTextProp: 'name',
      searchKeys: ['name'],
      dropdown: {
        maxItems: 20,
        classname: 'tags-look',
        enabled: 0,
        closeOnSelect: false,
      },
      templates: {
        dropdownItem(item) {
          return `<div ${this.getAttributes(item)} class='tagify__dropdown__item ${item.class ? item.class : ""}' tabindex="0" role="option">${item.name}</div>`;
        }
      },
    });
  }

  // --- LÓGICA PARA ENVÍO DEL FORMULARIO DE INFORMACIÓN PERSONAL ---
  const formPersonal = document.getElementById('formInformacionPersonal');
  if (formPersonal) {
    formPersonal.addEventListener('submit', async function (event) {
      event.preventDefault();
      document.querySelectorAll('.api-error').forEach(el => el.remove());

      const data = {
        nombre: formPersonal.nombre.value,
        apellido: formPersonal.apellido.value,
        fecha_nacimiento: formPersonal.fecha_nacimiento.value,
        sexo: formPersonal.sexo.value,
        telefono: formPersonal.telefono.value,
        email: formPersonal.email.value,
        direccion: formPersonal.direccion.value,
        nacionalidades: formPersonal.nacionalidades.value,
      };

      await enviarDatosPersonal(formPersonal.action, data);
    });
  }

  async function enviarDatosPersonal(url, data) {
    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.errors) {
          result.errors.forEach(error => {
            const inputElement = document.getElementById(error.path);
            if (inputElement) {
              const errorElement = document.createElement('div');
              errorElement.className = 'text-danger mt-1 small api-error';
              errorElement.textContent = error.msg;
              inputElement.parentElement.appendChild(errorElement);
            }
          });
        } else {
          mostrarAlerta(result.message || 'Ocurrió un error.', 'danger');
        }
      } else {
        mostrarAlerta(result.message, 'success');
      }
    } catch (error) {
      mostrarAlerta('No se pudo conectar con el servidor.', 'danger');
    }
  }
});