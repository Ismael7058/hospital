document.addEventListener('DOMContentLoaded', () => {
  const modalGestionEl = document.getElementById('modalGestionPacienteSeguro');
  if (!modalGestionEl) return;

  const modalGestionInstance = new bootstrap.Modal(modalGestionEl);
  const form = document.getElementById('formGestionPacienteSeguro');
  const idInput = document.getElementById('gestion_id');
  const submitBtn = form.querySelector('button[type="submit"]');

  modalGestionEl.addEventListener('show.bs.modal', (event) => {
    const button = event.relatedTarget;
    idInput.value = button.getAttribute('data-id');
    document.getElementById('gestion_seguro_medico_id').value = button.getAttribute('data-seguro-id');
    document.getElementById('gestion_seguro_medico_nombre').value = button.getAttribute('data-seguro-nombre');
    document.getElementById('gestion_nro_afiliado').value = button.getAttribute('data-nro-afiliado');
    document.getElementById('gestion_fecha_vigencia').value = button.getAttribute('data-fecha-vigencia');
    document.getElementById('gestion_fecha_expiracion').value = button.getAttribute('data-fecha-expiracion');
  });

  modalGestionEl.addEventListener('hidden.bs.modal', () => {
    form.reset();
    form.classList.remove('was-validated');
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    const id = idInput.value;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Renovando...`;

    try {
      const response = await fetch(`/api/paciente-seguros/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (!response.ok) {
        if (result && Array.isArray(result.errors)) {
          result.errors.forEach(err => mostrarAlerta(err.msg, 'danger'));
        } else {
          mostrarAlerta(result.message || 'Ocurrió un error al renovar el seguro.', 'danger');
        }
      } else {
        modalGestionInstance.hide();
        mostrarAlerta(result.message, 'success');
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (error) {
      mostrarAlerta('Error de conexión. No se pudo completar la solicitud.', 'danger');
    } finally {
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }, 500);
    }
  });
});
