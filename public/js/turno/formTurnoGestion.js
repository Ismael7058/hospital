document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-gestion-turno');

  // === Inicialización de Select2 para Médicos ===
  $('#select-medico').select2({
    theme: 'bootstrap-5',
    placeholder: 'Busque un médico por nombre, apellido o DNI...',
    minimumInputLength: 3,
    ajax: {
      url: '/api/usuarios/buscar?rol=Medico', // Ajusta este endpoint según tu API
      dataType: 'json',
      delay: 250,
      data: (params) => ({
        q: params.term
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

  // === Inicialización de Select2 para Pacientes ===
  $('#select-paciente').select2({
    theme: 'bootstrap-5',
    placeholder: 'Busque un paciente por nombre, apellido o DNI...',
    minimumInputLength: 3,
    ajax: {
      url: '/api/pacientes/buscar', // Ajusta este endpoint según tu API
      dataType: 'json',
      delay: 250,
      data: (params) => ({
        q: params.term
      }),
      processResults: (data) => ({
        results: $.map(data, (item) => {
          const doc = item.identificaciones && item.identificaciones.length > 0 ? item.identificaciones[0] : { tipo_doc: 'Doc', nro_doc: 'N/A' };
          return {
            id: item.id,
            text: `${item.nombre} ${item.apellido} (${doc.tipo_doc}: ${doc.nro_doc})`
          };
        })
      }),
      cache: true
    }
  });

  // === Manejo del envío del formulario ===
  if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Construir fechas completas (ISO) para el backend
    const fecha = document.getElementById('fecha').value;
    const horaInicio = document.getElementById('hora_inicio').value;
    const horaFin = document.getElementById('hora_fin').value;
    const id = document.getElementById('turno_id').value;
    
    const payload = {
        medico_id: $('#select-medico').val(),
        paciente_id: $('#select-paciente').val(),
        fecha: fecha,
        hora_inicio: horaInicio,
        hora_fin: horaFin,
        motivo: document.getElementById('motivo').value,
        estado: document.getElementById('estado').value
    };

    // Botón de carga
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Guardando...';

    try {
      const response = await fetch(`/api/turnos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        if (result && Array.isArray(result.errors)) {
          clearErrors();
          result.errors.forEach(err => {
            showError(err.path, err.msg);
          });
        } else {
          mostrarAlerta(result.message, 'danger');
        }
      } else {
        mostrarAlerta(result.message, 'success');
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (error) {
      console.error('Error:', error);
      mostrarAlerta('Error de conexión.','danger');
    } finally {
        setTimeout(() => submitBtn.disabled = false, 1000);
    }
  });
  }

  const validateForm = () => {
    clearErrors();
    let isValid = true;

    // Validar Select2
    if (!$('#select-medico').val()) {
      showError('medico_id', 'Debe seleccionar un médico.');
      isValid = false;
    }
    if (!$('#select-paciente').val()) {
      showError('paciente_id', 'Debe seleccionar un paciente.');
      isValid = false;
    }

    // Validar inputs normales
    ['fecha', 'hora_inicio', 'hora_fin', 'motivo'].forEach(field => {
        const input = document.getElementById(field);
        if (!input.value.trim()) {
            showError(field, 'Este campo es obligatorio.');
            isValid = false;
        }
    });
    
    return isValid;
  };

  const showError = (field, message) => {
    let elementId = field;
    if (field === 'medico_id') elementId = 'select-medico';
    if (field === 'paciente_id') elementId = 'select-paciente';
    
    const fieldElement = document.getElementById(elementId);
    const errorElement = document.getElementById(`error-${field}`);

    if (fieldElement) fieldElement.classList.add('is-invalid');
    if (errorElement) errorElement.textContent = message;
  };

  const clearErrors = () => {
    document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    document.querySelectorAll('.invalid-feedback').forEach(el => el.textContent = '');
    document.getElementById('general-error').classList.add('d-none');
  };

  // === Manejo de Modales ===

  // Confirmar Cambio de Estado (Alta/Baja)
  const confirmarEstadoModal = document.getElementById('confirmarEstadoModal');
  if (confirmarEstadoModal) {
    confirmarEstadoModal.addEventListener('show.bs.modal', event => {
      const button = event.relatedTarget;
      const id = button.getAttribute('data-id');
      const activo = button.getAttribute('data-activo') === 'true';
      const accion = button.getAttribute('data-accion');
      const clase = button.getAttribute('data-clase');
      
      const modalBody = confirmarEstadoModal.querySelector('.modal-body p');
      if (modalBody) modalBody.textContent = `¿Está seguro de que desea ${accion} este turno?`;

      const confirmBtn = document.getElementById('btnConfirmarEstado');
      
      // Aplicar clase de color dinámica (reinicia las clases base y agrega la específica)
      confirmBtn.className = 'btn';
      if (clase) confirmBtn.classList.add(clase);
      // Clonar para eliminar listeners previos
      const newBtn = confirmBtn.cloneNode(true);
      confirmBtn.parentNode.replaceChild(newBtn, confirmBtn);
      
      newBtn.addEventListener('click', async () => {
        const originalText = newBtn.innerHTML;
        newBtn.disabled = true;
        newBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Procesando...';

        try {
          const response = await fetch(`/api/turnos/${id}/activo`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ activo })
          });

            const result = await response.json();

          if (response.ok) {
            mostrarAlerta(result.message, 'success');
            setTimeout(() => window.location.reload(), 1000);
          } else {
            mostrarAlerta(result.message , 'warning');
            newBtn.disabled = false;
            newBtn.innerHTML = originalText;
          }
        } catch (error) {
          console.error(error);
          mostrarAlerta('Error de conexión.','danger');
          newBtn.disabled = false;
          newBtn.innerHTML = originalText;
        }
      });
    });
  }

  // Cancelar Turno
  const cancelarTurnoModal = document.getElementById('cancelarTurnoModal');
  if (cancelarTurnoModal) {
    cancelarTurnoModal.addEventListener('show.bs.modal', event => {
      const button = event.relatedTarget;
      const id = button.getAttribute('data-id');

      const confirmBtn = document.getElementById('btnCancelarTurno');
      
      const newBtn = confirmBtn.cloneNode(true);
      confirmBtn.parentNode.replaceChild(newBtn, confirmBtn);

      newBtn.addEventListener('click', async () => {
        const originalText = newBtn.innerHTML;
        newBtn.disabled = true;
        newBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Procesando...';

        try {
          const response = await fetch(`/api/turnos/${id}/estado`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: 'Cancelado' })
          });

          const result = await response.json();

          if (response.ok) {
            mostrarAlerta(result.message, 'success');
            setTimeout(() => window.location.reload(), 1000);
          } else {
            mostrarAlerta(result.message , 'warning');
            newBtn.disabled = false;
            newBtn.innerHTML = originalText;
          }
        } catch (error) {
          console.error(error);
          mostrarAlerta('Error de conexión.','danger');
          newBtn.disabled = false;
          newBtn.innerHTML = originalText;
        }
      });
    });
  }

  // Eliminar Turno
  const eliminarTurnoModal = document.getElementById('eliminarTurnoModal');
  if (eliminarTurnoModal) {
    eliminarTurnoModal.addEventListener('show.bs.modal', event => {
      const button = event.relatedTarget;
      const id = button.getAttribute('data-id');

      const confirmBtn = document.getElementById('btnEliminarTurno');
      
      const newBtn = confirmBtn.cloneNode(true);
      confirmBtn.parentNode.replaceChild(newBtn, confirmBtn);

      newBtn.addEventListener('click', async () => {
        const originalText = newBtn.innerHTML;
        newBtn.disabled = true;
        newBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Procesando...';

        try {
          const response = await fetch(`/api/turnos/${id}`, {
            method: 'DELETE'
          });

          const result = await response.json();

          if (response.ok) {
            mostrarAlerta(result.message, 'success');
            setTimeout(() => window.location.href = '/turnos', 1000);
          } else {
            mostrarAlerta(result.message , 'warning');
            newBtn.disabled = false;
            newBtn.innerHTML = originalText;
          }
        } catch (error) {
          console.error(error);
          mostrarAlerta('Error de conexión.','danger');
          newBtn.disabled = false;
          newBtn.innerHTML = originalText;
        }
      });
    });
  }
});
