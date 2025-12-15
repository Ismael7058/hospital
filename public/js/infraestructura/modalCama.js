document.addEventListener('DOMContentLoaded', () => {
  const modalElement = document.getElementById('modalCama');
  if (!modalElement) return;

  const modal = new bootstrap.Modal(modalElement);
  const form = document.getElementById('formCama');
  if (!form) return;

  const submitButton = modalElement.querySelector('button[type="submit"]');
  const modalLabel = document.getElementById('modalCamaLabel');

  // Campos del formulario
  const idInput = document.getElementById('camaId');
  const codigoInput = document.getElementById('camaCodigo');
  const alaSelect = $('#select-ala');
  const habitacionSelect = $('#select-habitacion');

  let filaEditada = null;

  // --- Inicialización de Select2 para Alas ---
  alaSelect.select2({
    theme: 'bootstrap-5',
    placeholder: 'Busque un ala por nombre...',
    minimumInputLength: 0,
    dropdownParent: $('#modalCama'),
    ajax: {
      url: '/api/infraestructura/ala/buscar',
      dataType: 'json',
      delay: 250,
      data: (params) => ({
        nombre: params.term
      }),
      processResults: (data) => ({
        results: $.map(data, (item) => ({
          id: item.id,
          text: item.nombre
        }))
      }),
      cache: true
    }
  });

  // --- Inicialización de Select2 para Habitaciones (dependiente de Ala) ---
  habitacionSelect.select2({
    theme: 'bootstrap-5',
    placeholder: 'Busque una habitación por número...',
    minimumInputLength: 0,
    dropdownParent: $('#modalCama'),
    ajax: {
      url: '/api/infraestructura/habitacion/buscar',
      dataType: 'json',
      delay: 250,
      data: (params) => ({
        numero: params.term,
        ala_id: alaSelect.val() // <-- La dependencia
      }),
      processResults: (data) => ({
        results: $.map(data, (item) => ({
          id: item.id,
          text: `N° ${item.numero}`
        }))
      }),
      cache: true
    }
  });

  // --- Lógica de dependencia ---
  alaSelect.on('change', function () {
    habitacionSelect.val(null).trigger('change'); // Limpia la selección de habitación
    habitacionSelect.prop('disabled', !$(this).val()); // Habilita/deshabilita el select de habitación
  });

  // --- Lógica para abrir el modal de Cama ---
  modalElement.addEventListener('show.bs.modal', async (event) => {
    const button = event.relatedTarget;
    const id = button.getAttribute('data-id');

    if (id) {
      // --- Modo Edición ---
      modalLabel.textContent = 'Editar Cama';
      filaEditada = button.closest('tr');
      const url = button.getAttribute('data-url');

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('No se pudo cargar la información de la cama.');

        const cama = await response.json();

        // Rellenar el formulario
        idInput.value = cama.id;
        codigoInput.value = cama.codigo;

        // Si la cama tiene una habitación (y por tanto un ala), cargamos ambos selectores
        if (cama.habitacion && cama.habitacion.ala) {
          // 1. Crear y seleccionar la opción para el Ala
          const alaOption = new Option(cama.habitacion.ala.nombre, cama.habitacion.ala.id, true, true);
          alaSelect.append(alaOption).trigger('change');

          // 2. Habilitar y seleccionar la opción para la Habitación
          habitacionSelect.prop('disabled', false);
          const habitacionOption = new Option(`N° ${cama.habitacion.numero}`, cama.habitacion.id, true, true);
          habitacionSelect.append(habitacionOption).trigger('change');
        }

      } catch (error) {
        mostrarAlerta(error.message, 'danger');
        modal.hide();
      }
    } else {
      // --- Modo Creación ---
      modalLabel.textContent = 'Nueva Cama';
      filaEditada = null;
    }
  });

  // --- Lógica para enviar el formulario de Cama ---
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Guardando...`;

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const url = data.id ? `/api/infraestructura/cama/${data.id}/edit` : '/api/infraestructura/cama/register';
      const method = data.id ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        mostrarAlerta(result.message, 'success');
        modal.hide();

        // Para creación o edición, recargar la página para ver los cambios
        if (method === 'PATCH' && filaEditada) {
          filaEditada.cells[0].textContent = data.codigo;
          filaEditada.cells[1].textContent = alaSelect.select2('data')[0].text;
          filaEditada.cells[2].textContent = habitacionSelect.select2('data')[0].text;
        } else { // Para creación
          setTimeout(() => window.location.reload(), 1000);
        }
      } else {
        if (result.errors) {
          clearErrors();
          result.errors.forEach(err => showError(err.path, err.msg));
        }
        mostrarAlerta(result.message || 'Ocurrió un error.', 'danger');
      }
    } catch (error) {
      mostrarAlerta('No se pudo conectar con el servidor.', 'danger');
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;
    }
  });

  // --- Lógica para limpiar el modal de Cama al cerrarse ---
  modalElement.addEventListener('hidden.bs.modal', () => {
    clearErrors();
    form.reset();
    idInput.value = '';
    // Limpiar y deshabilitar los selectores
    alaSelect.val(null).trigger('change');
    habitacionSelect.val(null).trigger('change').prop('disabled', true);
    filaEditada = null;
  });

  // --- Funciones de validación y errores para Cama ---
  const validateForm = () => {
    clearErrors();
    let isValid = true;
    if (!codigoInput.value.trim()) isValid = showError('codigo', 'El código es obligatorio.');
    if (!alaSelect.val()) isValid = showError('ala_id', 'Debe seleccionar un ala.');
    if (!habitacionSelect.val()) isValid = showError('habitacion_id', 'Debe seleccionar una habitación.');
    return isValid;
  };

  const showError = (field, message) => {
    const input = document.getElementById({
      codigo: 'camaCodigo',
      ala_id: 'select-ala',
      habitacion_id: 'select-habitacion'
    }[field] || field);

    const errorFeedback = document.getElementById(`error-${field}`);
    if (input) input.classList.add('is-invalid');
    if (errorFeedback) errorFeedback.textContent = message;
    return false;
  };

  const clearErrors = () => {
    document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    document.querySelectorAll('.invalid-feedback').forEach(el => el.textContent = '');
  };
});