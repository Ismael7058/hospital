document.addEventListener('DOMContentLoaded', function () {
  // --- LÓGICA PARA IDENTIFICACIONES DINÁMICAS ---
  const container = document.getElementById('identificaciones-container');
  if (!container) return;

  const addButton = document.getElementById('btn-add-identificacion');
  let identificacionIndex = 1;

  const firstSelect = container.querySelector('select');
  const maxIdentificaciones = firstSelect ? firstSelect.querySelectorAll('option:not([value=""])').length : 3;

  const updateAddButtonState = () => {
    const currentItemsCount = container.querySelectorAll('.identificacion-item').length;
    if (addButton) addButton.disabled = currentItemsCount >= maxIdentificaciones;
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
        if (!/^\d{8}$/.test(nro_doc)) errorMessage = 'El DNI debe contener exactamente 8 dígitos.';
        break;
      case 'Pasaporte':
        if (!/^[a-zA-Z0-9]{6,9}$/.test(nro_doc)) errorMessage = 'El Pasaporte debe ser alfanumérico y tener entre 6 y 9 caracteres.';
        break;
      case 'Cédula':
        if (!/^\d{7,11}$/.test(nro_doc)) errorMessage = 'La Cédula debe contener entre 7 y 11 dígitos.';
        break;
    }
    nroDocInput.setCustomValidity(errorMessage);
  };

  const updateIdentificacionOptions = () => {
    const selects = container.querySelectorAll('select[name^="identificaciones"]');
    const selectedValues = new Set();

    selects.forEach(select => {
      if (select.value) selectedValues.add(select.value);
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
    items.forEach((item) => {
      const removeBtn = item.querySelector('.btn-remove-identificacion');
      if (removeBtn) removeBtn.style.display = items.length > 1 ? '' : 'none';
    });
  };

  if (addButton) {
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
  }

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

  // --- LÓGICA PARA ENVÍO DEL FORMULARIO DE IDENTIFICACIONES ---
  const formIdentificacion = document.getElementById('formIdentificacion');
  if (formIdentificacion) {
    formIdentificacion.addEventListener('submit', async function (event) {
      event.preventDefault();
      document.querySelectorAll('.api-error').forEach(el => el.remove());

      const data = { identificaciones: [] };
      document.querySelectorAll('.identificacion-item').forEach(item => {
        const tipo_doc = item.querySelector('select').value;
        const nro_doc = item.querySelector('input[type="text"]').value;
        if (tipo_doc || nro_doc) {
          data.identificaciones.push({ tipo_doc, nro_doc });
        }
      });

      await enviarDatosIdentificacion(formIdentificacion.action, data);
    });
  }

  async function enviarDatosIdentificacion(url, data) {
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
            const inputElement = document.getElementById('identificaciones-container');
            const errorElement = document.createElement('div');
            errorElement.className = 'text-danger mt-1 small api-error';
            errorElement.textContent = error.msg;
            inputElement.parentElement.appendChild(errorElement);
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