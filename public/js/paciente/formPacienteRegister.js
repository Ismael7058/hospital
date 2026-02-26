document.addEventListener('DOMContentLoaded', function () {
  // --- LÓGICA PARA TAGIFY (NACIONALIDADES) ---
  const nacionalidadesInput = document.querySelector('#nacionalidades-input');
  if (nacionalidadesInput) {
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

  const container = document.getElementById('identificaciones-container');
  const addButton = document.getElementById('btn-add-identificacion');
  let identificacionIndex = 1;

  const firstSelect = container.querySelector('select');
  const maxIdentificaciones = firstSelect ? firstSelect.querySelectorAll('option:not([value=""])').length : 3;

  const updateAddButtonState = () => {
    const currentItemsCount = container.querySelectorAll('.identificacion-item').length;
    addButton.disabled = currentItemsCount >= maxIdentificaciones;
  };

  const validateIdentificacionInput = (nroDocInput) => {
    const item = nroDocInput.closest('.identificacion-item');
    if (!item) return;

    const tipoDocSelect = item.querySelector('select');
    const tipo_doc = tipoDocSelect.value;
    const nro_doc = nroDocInput.value;

    nroDocInput.setCustomValidity('');

    if (!nro_doc) return;

    let errorMessage = '';
    switch (tipo_doc) {
      case 'DNI':
        if (!/^\d{8}$/.test(nro_doc)) {
          errorMessage = 'El DNI debe contener exactamente 8 dígitos.';
        }
        break;
      case 'Pasaporte':
        if (!/^[a-zA-Z0-9]{6,9}$/.test(nro_doc)) {
          errorMessage = 'El Pasaporte debe ser alfanumérico y tener entre 6 y 9 caracteres.';
        }
        break;
      case 'Cédula':
        if (!/^\d{7,11}$/.test(nro_doc)) {
          errorMessage = 'La Cédula debe contener entre 7 y 11 dígitos.';
        }
        break;
    }
    nroDocInput.setCustomValidity(errorMessage);
  };

  const updateIdentificacionOptions = () => {
    const selects = container.querySelectorAll('select[name^="identificaciones"]');
    const selectedValues = new Set();

    selects.forEach(select => {
      if (select.value) {
        selectedValues.add(select.value);
      }
    });

    selects.forEach(select => {
      const currentSelectValue = select.value;
      const options = select.querySelectorAll('option');

      options.forEach(option => {
        if (option.value && option.value !== currentSelectValue) {
          option.disabled = selectedValues.has(option.value);
        } else {
          option.disabled = false;
        }
      });
    });
  };

  const updateRemoveButtons = () => {
    const items = container.querySelectorAll('.identificacion-item');
    items.forEach((item, index) => {
      const removeBtn = item.querySelector('.btn-remove-identificacion');
      removeBtn.style.display = items.length > 1 ? '' : 'none';
    });
  };

  addButton.addEventListener('click', () => {
    const newItem = container.querySelector('.identificacion-item').cloneNode(true);

    newItem.querySelector('select').name = `identificaciones[${identificacionIndex}][tipo_doc]`;
    newItem.querySelector('select').value = '';
    newItem.querySelector('input').name = `identificaciones[${identificacionIndex}][nro_doc]`;
    newItem.querySelector('input').value = '';

    container.appendChild(newItem);
    identificacionIndex++;
    updateRemoveButtons();
    updateAddButtonState();
    updateIdentificacionOptions();
  });

  container.addEventListener('click', function (e) {
    if (e.target && e.target.closest('.btn-remove-identificacion')) {
      e.target.closest('.identificacion-item').remove();
      updateRemoveButtons();
      updateAddButtonState();
      updateIdentificacionOptions();
    }
  });

  container.addEventListener('change', function(e) {
    if (e.target && e.target.tagName === 'SELECT') {
      const nroDocInput = e.target.closest('.identificacion-item').querySelector('input[type="text"]');
      updateIdentificacionOptions();
      validateIdentificacionInput(nroDocInput);
    }
  });

  container.addEventListener('input', function(e) {
    if (e.target && e.target.matches('input[name^="identificaciones"]')) {
      validateIdentificacionInput(e.target);
    }
  });


  updateRemoveButtons();
  updateAddButtonState();
  updateIdentificacionOptions();


  const form = document.getElementById('registroPacienteForm');
  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    document.querySelectorAll('.api-error').forEach(el => el.remove());

    const data = {
      nombre: form.nombre.value,
      apellido: form.apellido.value,
      fecha_nacimiento: form.fecha_nacimiento.value,
      sexo: form.sexo.value,
      telefono: form.telefono.value,
      email: form.email.value,
      direccion: form.direccion.value,
      nacionalidades: form.nacionalidades.value,
    };

    data.identificaciones = [];
    document.querySelectorAll('.identificacion-item').forEach(item => {
      const tipo_doc = item.querySelector('select').value;
      const nro_doc = item.querySelector('input[type="text"]').value;
      if (tipo_doc || nro_doc) {
        data.identificaciones.push({ tipo_doc, nro_doc });
      }
    });

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.errors) {
          result.errors.forEach(error => {
            if (error.path.startsWith('identificaciones[')) {
              const fieldName = 'identificaciones';
              const inputElement = document.getElementById('identificaciones-container');
              const errorElement = document.createElement('div');
              errorElement.className = 'text-danger mt-1 small api-error';
              errorElement.textContent = error.msg;
              inputElement.parentElement.appendChild(errorElement);
            } else {
              const inputElement = document.getElementById(error.path);
              if (inputElement) {
                const errorElement = document.createElement('div');
                errorElement.className = 'text-danger mt-1 small api-error';
                errorElement.textContent = error.msg;
                inputElement.parentElement.appendChild(errorElement);
              }else{
                mostrarAlerta(error.msg, 'danger');
              }
            }
          });
        } else {
          mostrarAlerta(result.message || 'Ocurrió un error.', 'danger');
        }
      } else {
        mostrarAlerta(result.message, 'success');
        setTimeout(() => {
          window.location.href = '/pacientes';
        }, 1500);
      }
    } catch (error) {
      mostrarAlerta( error.message || 'No se pudo conectar con el servidor. Por favor, intente más tarde.', 'danger');
    }
  });
});
