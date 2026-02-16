document.addEventListener('DOMContentLoaded', () => {
  const modalTraslado = document.getElementById('modalTraslado');
  if (!modalTraslado) return;

  const form = document.getElementById('formTrasladoPaciente');
  const habitacionSelect = document.getElementById('habitacion_id');
  const camaSelect = document.getElementById('cama_id');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const admisionId = form.querySelector('input[name="admision_id"]').value;
    const camaId = camaSelect.value;

    if (!camaId) {
      mostrarAlerta('Por favor, seleccione una cama válida.', 'warning');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Procesando...';

    try {
      const response = await fetch(`/api/admisiones/${admisionId}/cama`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cama_id: parseInt(camaId) })
      });

      const result = await response.json();

      if (response.ok) {
        // Cerrar modal
        const modalInstance = bootstrap.Modal.getInstance(modalTraslado);
        modalInstance.hide();

        mostrarAlerta(result.message || 'Traslado realizado con éxito', 'success');

        setTimeout(() => {window.location.reload();}, 1000);
      } else {
        let mensajeError = result.message || 'Error al realizar el traslado';
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

  function resetSelect(selectElement, placeholder) {
    selectElement.innerHTML = `<option value="">${placeholder}</option>`;
    selectElement.disabled = true;
  }

  modalTraslado.addEventListener('hidden.bs.modal', () => {
    form.reset();
    resetSelect(habitacionSelect, 'Seleccione Ala primero');
    resetSelect(camaSelect, 'Seleccione Habitación primero');
  });
});
