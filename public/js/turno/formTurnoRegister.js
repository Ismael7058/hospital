document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-registrar-turno');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const fecha = document.getElementById('fecha').value;
    const horaInicio = document.getElementById('hora_inicio').value;
    const horaFin = document.getElementById('hora_fin').value;
    
    const payload = {
        medico_id: $('#select-medico').val(),
        paciente_id: $('#select-paciente').val(),
        fecha: fecha,
        hora_inicio: horaInicio,
        hora_fin: horaFin,
        motivo: document.getElementById('motivo').value
    };

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Guardando...';

    try {
      const response = await fetch('/api/turnos/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        if (result && Array.isArray(result.errors)) {
          result.errors.forEach(err => mostrarAlerta(err.msg, 'danger'));
        } else {
          mostrarAlerta(result.message || 'Ocurrió un error al renovar el seguro.', 'danger');
        }
      } else {
        mostrarAlerta(result.message, 'success');
        setTimeout(() => window.location.href = `/turnos/${result.turno.id}`, 1000);
      }
    } catch (error) {
      mostrarAlerta('Error de conexión. No se pudo completar la solicitud.', 'danger');
    } finally {
      setTimeout(() => {
        submitBtn.disabled = false
        submitBtn.innerHTML = originalBtnText
      }, 1000);
    }
  });

  const validateForm = () => {
    clearErrors();
    let isValid = true;

    if (!$('#select-medico').val()) {
      showError('medico_id', 'Debe seleccionar un médico.');
      isValid = false;
    }
    if (!$('#select-paciente').val()) {
      showError('paciente_id', 'Debe seleccionar un paciente.');
      isValid = false;
    }

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
  };
});
