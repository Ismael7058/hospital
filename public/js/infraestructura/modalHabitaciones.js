document.addEventListener('DOMContentLoaded', () => {
  const modalElement = document.getElementById('modalHabitacion');
  if (!modalElement) return;

  const modal = new bootstrap.Modal(modalElement);
  const form = document.getElementById('formHabitacion');
  if (!form) return;

  const submitButton = modalElement.querySelector('button[type="submit"]');
  const modalLabel = document.getElementById('modalHabitacionLabel');

  const idInput = document.getElementById('habitacionId');
  const numeroInput = document.getElementById('numeroHabitacion');
  const capacidadInput = document.getElementById('capacidadHabitacion');
  const descripcionInput = document.getElementById('descripcionHabitacion');
  const alaSelect = $('#select-ala');

  let filaEditada = null;

  // --- Inicialización de Select2 para Alas ---
  alaSelect.select2({
    theme: 'bootstrap-5',
    placeholder: 'Busque un ala por nombre...',
    minimumInputLength: 0,
    dropdownParent: $('#modalHabitacion'),
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

  // --- Lógica para abrir el modal ---
  modalElement.addEventListener('show.bs.modal', async (event) => {
    const button = event.relatedTarget;
    const id = button.getAttribute('data-id');

    if (id) {
      // Modo Edición
      modalLabel.textContent = 'Editar Habitación';
      filaEditada = button.closest('tr');
      const url = button.getAttribute('data-url');

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('No se pudo cargar la información de la habitación.');

        const habitacion = await response.json();

        // Rellenar el formulario
        idInput.value = habitacion.id;
        numeroInput.value = habitacion.numero;
        capacidadInput.value = habitacion.capacidad;
        descripcionInput.value = habitacion.descripcion;

        // Para Select2, si hay un ala, creamos la opción y la seleccionamos
        if (habitacion.ala) {
          const option = new Option(habitacion.ala.nombre, habitacion.ala.id, true, true);
          alaSelect.append(option).trigger('change');
        }

      } catch (error) {
        mostrarAlerta(error.message, 'danger');
        modal.hide();
      }
    } else {
      // --- Modo Creación ---
      modalLabel.textContent = 'Nueva Habitación';
      filaEditada = null;
    }
  });

  // --- Lógica para enviar el formulario ---
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Guardando...`; // lgtm [js/inner-html-manipulation]

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const url = data.id ? `/api/infraestructura/habitacion/${data.id}/edit` : '/api/infraestructura/habitacion/register';
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

        // Actualizar la tabla dinámicamente o recargar
        if (method === 'PATCH' && filaEditada) {
          filaEditada.cells[0].textContent = data.numero;
          filaEditada.cells[1].textContent = alaSelect.select2('data')[0].text;
          filaEditada.cells[2].textContent = data.descripcion;
          filaEditada.cells[3].textContent = data.capacidad;
        } else {
          setTimeout(() => window.location.reload(), 1500);
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
      submitButton.innerHTML = originalButtonText; // lgtm [js/inner-html-manipulation]
    }
  });

  // --- Lógica para limpiar el modal al cerrarse ---
  modalElement.addEventListener('hidden.bs.modal', () => {
    clearErrors();
    form.reset();
    idInput.value = '';
    alaSelect.val(null).trigger('change'); // Limpiar Select2
    filaEditada = null;
  });

  // --- Funciones de validación y errores ---
  const validateForm = () => {
    clearErrors();
    let isValid = true;
    if (!numeroInput.value.trim()) isValid = showError('numero', 'El número es obligatorio.');
    if (!capacidadInput.value.trim()) isValid = showError('capacidad', 'La capacidad es obligatoria.');
    if (!descripcionInput.value.trim()) isValid = showError('descripcion', 'La descripción es obligatoria.');
    if (!alaSelect.val()) isValid = showError('ala_id', 'Debe seleccionar un ala.');
    return isValid;
  };

  const showError = (field, message) => {
    const input = document.getElementById({
      numero: 'numeroHabitacion',
      capacidad: 'capacidadHabitacion',
      descripcion: 'descripcionHabitacion',
      ala_id: 'select-ala'
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