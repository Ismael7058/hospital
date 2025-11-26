document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-registrar-matricula');
  if (!form) return;

  // === Inicialización de Select2 para Usuarios ===
  $('#select-usuario').select2({
    theme: 'bootstrap-5',
    placeholder: 'Busque un usuario por DNI, nombre o apellido...',
    minimumInputLength: 3,
    ajax: {
      url: '/api/usuarios/buscar', // Endpoint para buscar usuarios
      dataType: 'json',
      delay: 250,
      data: (params) => ({
        q: params.term // Término de búsqueda
      }),
      processResults: (data) => ({
        results: $.map(data, (item) => ({
          id: item.id,
          text: `${item.nombre} ${item.apellido} (DNI: ${item.dni})`
        }))
      }),
      cache: true
    }
  });

  // === Manejo del envío del formulario ===
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Detiene el envío si la validación del cliente falla
    }

    const formData = {
      usuario_id: $('#select-usuario').val(),
      numero: document.getElementById('numero').value,
      tipo: document.getElementById('tipo').value,
      entidad_emisora: document.getElementById('entidad_emisora').value,
      fecha_emision: document.getElementById('fecha_emision').value,
      fecha_vencimiento: document.getElementById('fecha_vencimiento').value
    };

    try {
      const response = await fetch('/api/matriculas/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        // Muestra los errores de validación del servidor
        if (result && Array.isArray(result.errors)) {
          clearErrors();
          result.errors.forEach(err => {
            showError(err.path, err.msg);
          });
        } else {
          throw new Error(`Error del servidor (${response.status}): ${result.message || 'Error inesperado'}`);
        }
      } else {
        // Éxito: Redirigir al listado con un mensaje
        window.location.href = '/matriculas/Listar?success=Matrícula registrada exitosamente';
      }
    } catch (error) {
      console.error('Error en el envío del formulario:', error);
      alert('Ocurrió un error inesperado. Por favor, intente de nuevo.');
    }
  });

  const validateForm = () => {
    clearErrors();
    let isValid = true;

    const fieldsToValidate = ['numero', 'tipo', 'entidad_emisora', 'fecha_emision', 'fecha_vencimiento'];
    fieldsToValidate.forEach(fieldId => {
      const input = document.getElementById(fieldId);
      if (!input.value.trim()) {
        showError(fieldId, 'Este campo es obligatorio.');
        isValid = false;
      }
    });

    // Validar Select2
    const usuarioId = $('#select-usuario').val();
    if (!usuarioId) {
      showError('usuario_id', 'Debe seleccionar un titular.');
      $('#select-usuario').select2('open'); // Abre el desplegable para facilitar la selección
      isValid = false;
    }

    // Validar fechas
    const fechaEmision = document.getElementById('fecha_emision').value;
    const fechaVencimiento = document.getElementById('fecha_vencimiento').value;
    if (fechaEmision && fechaVencimiento && new Date(fechaVencimiento) < new Date(fechaEmision)) {
      showError('fecha_vencimiento', 'La fecha de vencimiento no puede ser anterior a la fecha de emisión.');
      isValid = false;
    }

    return isValid;
  };

  const showError = (field, message) => {
    // Para Select2, el ID del campo es 'usuario_id', pero el elemento es 'select-usuario'
    const elementId = field === 'usuario_id' ? 'select-usuario' : field;
    const fieldElement = document.getElementById(elementId);
    const errorElement = document.getElementById(`error-${field}`);

    if (fieldElement) fieldElement.classList.add('is-invalid');
    if (errorElement) errorElement.textContent = message;
  };

  const clearErrors = () => {
    document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    document.querySelectorAll('.invalid-feedback').forEach(el => el.textContent = '');
  };
});
