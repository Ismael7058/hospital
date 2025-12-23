document.addEventListener('DOMContentLoaded', () => {
  const modalGestion = document.getElementById('modalGestionPacienteSeguro');
  if (!modalGestion) return;

  const form = document.getElementById('formGestionPacienteSeguro');
  const errorContainer = document.getElementById('error-container-gestion');
  const btnActivar = document.getElementById('btn-activar');
  const btnDesactivar = document.getElementById('btn-desactivar');
  const idInput = document.getElementById('gestion_id');

  // Cargar datos en el modal desde los atributos data- del botón
  modalGestion.addEventListener('show.bs.modal', (event) => {
    const button = event.relatedTarget;
    
    idInput.value = button.getAttribute('data-id');
    document.getElementById('gestion_seguro_medico_id').value = button.getAttribute('data-seguro-id');
    document.getElementById('gestion_seguro_medico_nombre').value = button.getAttribute('data-seguro-nombre');
    document.getElementById('gestion_nro_afiliado').value = button.getAttribute('data-nro-afiliado');
    document.getElementById('gestion_fecha_vigencia').value = button.getAttribute('data-fecha-vigencia');
    document.getElementById('gestion_fecha_expiracion').value = button.getAttribute('data-fecha-expiracion');

    const activo = button.getAttribute('data-activo') === 'true';
    if (activo) {
      btnActivar.classList.add('d-none');
      btnDesactivar.classList.remove('d-none');
    } else {
      btnDesactivar.classList.add('d-none');
      btnActivar.classList.remove('d-none');
    }
  });

  // Limpiar al cerrar
  modalGestion.addEventListener('hidden.bs.modal', () => {
    form.reset();
    form.classList.remove('was-validated');
    errorContainer.classList.add('d-none');
  });

  // Manejar Edición
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    const id = idInput.value;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(`/api/paciente-seguros/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Error al actualizar.');

      mostrarAlerta('Seguro actualizado correctamente.', 'success');
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      errorContainer.textContent = error.message;
      errorContainer.classList.remove('d-none');
    }
  });
});
