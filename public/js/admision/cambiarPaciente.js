document.addEventListener('DOMContentLoaded', () => {
  const modalTraslado = document.getElementById('modalReasignar');
  if (!modalTraslado) return;

  const form = document.getElementById('formReasignarPaciente');
  const pacienteSelect = document.getElementById('select-paciente');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const admisionId = form.querySelector('input[name="admision_id"]').value;
    const pacienteId = pacienteSelect.value;

    if (!pacienteId) {
      mostrarAlerta('Por favor, seleccione un paciente.', 'warning');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Cambiando...';

    try {
      const response = await fetch(`/api/admisiones/${admisionId}/cambiar-paciente`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ paciente_id: parseInt(pacienteId) })
      });

      const result = await response.json();

      if (response.ok) {
        const modalInstance = bootstrap.Modal.getInstance(modalTraslado);
        modalInstance.hide();

        mostrarAlerta(result.message || 'Paciente reasignado con éxito', 'success');

        setTimeout(() => {window.location.reload();}, 1000);
      } else {
        let mensajeError = result.message || 'Error al reasignar el paciente';
        if (result.errors && Array.isArray(result.errors)) {
          mensajeError = result.errors.map(e => e.msg).join('. ');
        }
        mostrarAlerta(mensajeError, 'danger');
      }
    } catch (error) {
      console.error('Error:', error);
      mostrarAlerta(error.message ||'Error de conexión con el servidor.', 'danger');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });

  modalTraslado.addEventListener('hidden.bs.modal', () => {
    form.reset();
  });
});
