document.addEventListener('DOMContentLoaded', () => {
  const modalGestion = document.getElementById('modalGestionTipoAntecedente');
  if (!modalGestion) return;

  const form = document.getElementById('formGestionTipoAntecedente');
  const errorContainer = document.getElementById('error-container-gestion-tipo-antecedente');
  const idInput = document.getElementById('gestion_tipo_antecedente_id');
  const nombreInput = document.getElementById('gestion_nombre_tipo_antecedente');
  const btnActivar = document.getElementById('btn-activar-tipo-antecedente');
  const btnDesactivar = document.getElementById('btn-desactivar-tipo-antecedente');

  // Cargar datos en el modal cuando se muestra
  modalGestion.addEventListener('show.bs.modal', async (event) => {
    const button = event.relatedTarget;
    const tipoAntecedenteId = button.getAttribute('data-id');

    try {
      const response = await fetch(`/api/tipo-antecedente/${tipoAntecedenteId}`);
      if (!response.ok) {
        throw new Error('No se pudo obtener la información del Tipo de Antecedente');
      }
      const { tipoAntecedente } = await response.json();

      idInput.value = tipoAntecedente.id;
      nombreInput.value = tipoAntecedente.nombre;

      if (tipoAntecedente.activo) {
        btnActivar.classList.add('d-none');
        btnDesactivar.classList.remove('d-none');
      } else {
        btnDesactivar.classList.add('d-none');
        btnActivar.classList.remove('d-none');
      }
    } catch (error) {
      console.error('Error al cargar datos del tipo de antecedente:', error);
      const bootstrapModal = bootstrap.Modal.getInstance(modalGestion);
      bootstrapModal.hide();
      mostrarAlerta('Error al cargar los datos del tipo de antecedente', 'danger');
    }
  });

  modalGestion.addEventListener('hidden.bs.modal', () => {
    form.reset();
    form.classList.remove('was-validated');
    errorContainer.classList.add('d-none');
    errorContainer.textContent = '';
  });

  const actualizarFilaTabla = (id, data) => {
    const fila = document.getElementById(`tipo-antecedente-row-${id}`);
    if (!fila) return;

    if (data.nombre) {
      const celdaNombre = fila.querySelector('.nombre-tipo-antecedente');
      if (celdaNombre) celdaNombre.textContent = data.nombre;
    }

    if (typeof data.activo === 'boolean') {
      const celdaEstado = fila.querySelector('.estado-tipo-antecedente');
      if (celdaEstado) {
        const badge = celdaEstado.querySelector('.badge');
        badge.textContent = data.activo ? 'Activo' : 'Inactivo';
        badge.className = `badge ${data.activo ? 'bg-success' : 'bg-danger'}`;
      }
    }
  };

  // Manejar la actualización del nombre
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    const tipoAntecedenteId = idInput.value;
    const data = { nombre: nombreInput.value };

    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonHtml = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Guardando...`;

    try {
      const response = await fetch(`/api/tipo-antecedente/${tipoAntecedenteId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        mostrarAlerta(result.message || 'Error al actualizar.', 'danger');
        return;
      }

      mostrarAlerta('Tipo de Antecedente actualizado con éxito.', 'success');
      actualizarFilaTabla(tipoAntecedenteId, { nombre: data.nombre });
    } catch (error) {
      errorContainer.textContent = 'Error de conexión.';
      errorContainer.classList.remove('d-none');
    } finally {
      submitButton.innerHTML = originalButtonHtml;
      setTimeout(() => {
        submitButton.disabled = false;
      }, 1500);
    }
  });

  // Manejar cambio de estado (activar/desactivar)
  const cambiarEstado = async (nuevoEstado, botonPresionado) => {
    const tipoAntecedenteId = idInput.value;
    const verbo = nuevoEstado ? 'activar' : 'desactivar';

    const originalButtonHtml = botonPresionado.innerHTML;
    btnActivar.disabled = true;
    btnDesactivar.disabled = true;
    botonPresionado.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Procesando...`;

    try {
      const response = await fetch(`/api/tipo-antecedente/${tipoAntecedenteId}/activo`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo: nuevoEstado }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || `Error al ${verbo}.`);
      }

      mostrarAlerta(`Tipo de Antecedente ${verbo === 'activar' ? 'activada' : 'desactivada'} correctamente.`, 'success');

      actualizarFilaTabla(tipoAntecedenteId, { activo: nuevoEstado });

      if (nuevoEstado) {
        btnActivar.classList.add('d-none');
        btnDesactivar.classList.remove('d-none');
      } else {
        btnDesactivar.classList.add('d-none');
        btnActivar.classList.remove('d-none');
      }
    } catch (error) {
      mostrarAlerta(error.message, 'danger');
    } finally {
      botonPresionado.innerHTML = originalButtonHtml;
      setTimeout(() => {
        btnActivar.disabled = false;
        btnDesactivar.disabled = false;
      }, 1500);
    }
  };

  btnActivar.addEventListener('click', (event) => {
    const nuevoEstado = btnActivar.getAttribute('data-nuevo-estado') === 'true';
    cambiarEstado(nuevoEstado, event.currentTarget);
  });

  btnDesactivar.addEventListener('click', (event) => {
    const nuevoEstado = btnDesactivar.getAttribute('data-nuevo-estado') === 'true';
    cambiarEstado(nuevoEstado, event.currentTarget);
  });
});