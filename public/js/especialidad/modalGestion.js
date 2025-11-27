document.addEventListener('DOMContentLoaded', () => {
  const modalGestion = document.getElementById('modalGestionEspecialidad');
  if (!modalGestion) return;

  const form = document.getElementById('formGestionEspecialidad');
  const errorContainer = document.getElementById('error-container-gestion-especialidad');
  const idInput = document.getElementById('gestion_especialidad_id');
  const nombreInput = document.getElementById('gestion_nombre_especialidad');
  const btnActivar = document.getElementById('btn-activar-especialidad');
  const btnDesactivar = document.getElementById('btn-desactivar-especialidad');

  // Cargar datos en el modal cuando se muestra
  modalGestion.addEventListener('show.bs.modal', async (event) => {
    const button = event.relatedTarget;
    const especialidadId = button.getAttribute('data-id');

    try {
      const response = await fetch(`/api/especialidades/${especialidadId}`);
      if (!response.ok) {
        throw new Error('No se pudo obtener la información de la especialidad.');
      }
      const especialidad = await response.json();

      // Poblar el formulario
      idInput.value = especialidad.id;
      nombreInput.value = especialidad.nombre;

      // Configurar botones de estado
      if (especialidad.activo) {
        btnActivar.classList.add('d-none');
        btnDesactivar.classList.remove('d-none');
      } else {
        btnDesactivar.classList.add('d-none');
        btnActivar.classList.remove('d-none');
      }
    } catch (error) {
      console.error('Error al cargar datos de especialidad:', error);
      // Opcional: cerrar el modal y mostrar una notificación de error
      const bootstrapModal = bootstrap.Modal.getInstance(modalGestion);
      bootstrapModal.hide();
      mostrarAlerta('Error al cargar los datos de la especialidad.', 'danger');
    }
  });

  // Limpiar el modal al cerrarse
  modalGestion.addEventListener('hidden.bs.modal', () => {
    form.reset();
    form.classList.remove('was-validated');
    errorContainer.classList.add('d-none');
    errorContainer.textContent = '';
  });

  // Función para actualizar la fila de la tabla dinámicamente
  const actualizarFilaTabla = (id, data) => {
    const fila = document.getElementById(`especialidad-row-${id}`);
    if (!fila) return;

    if (data.nombre) {
      const celdaNombre = fila.querySelector('.nombre-especialidad');
      if (celdaNombre) celdaNombre.textContent = data.nombre;
    }

    if (typeof data.activo === 'boolean') {
      const celdaEstado = fila.querySelector('.estado-especialidad');
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

    const especialidadId = idInput.value;
    const data = { nombre: nombreInput.value };

    // Deshabilitar el botón de guardar para evitar clics repetidos
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonHtml = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Guardando...`;

    try {
      const response = await fetch(`/api/especialidades/${especialidadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        // Usar la alerta temporal en lugar del contenedor de error fijo
        mostrarAlerta(result.message || 'Error al actualizar.', 'danger');
        return;
      }

      // No cerramos el modal ni recargamos la página
      mostrarAlerta('Especialidad actualizada con éxito.', 'success');
      // Actualizamos la tabla dinámicamente
      actualizarFilaTabla(especialidadId, { nombre: data.nombre });
    } catch (error) {
      errorContainer.textContent = 'Error de conexión.';
      errorContainer.classList.remove('d-none');
    } finally {
      // Restaurar el contenido original del botón inmediatamente
      submitButton.innerHTML = originalButtonHtml;
      // Mantener el botón deshabilitado por 1.5 segundos para evitar clics rápidos
      setTimeout(() => {
        submitButton.disabled = false;
      }, 1500); // 1.5 segundos de cooldown
    }
  });

  // Manejar cambio de estado (activar/desactivar)
  const cambiarEstado = async (nuevoEstado, botonPresionado) => {
    const especialidadId = idInput.value;
    const verbo = nuevoEstado ? 'activar' : 'desactivar';

    // Deshabilitar ambos botones de estado y mostrar spinner en el presionado
    const originalButtonHtml = botonPresionado.innerHTML;
    btnActivar.disabled = true;
    btnDesactivar.disabled = true;
    botonPresionado.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Procesando...`;

    try {
      const response = await fetch(`/api/especialidades/estado/${especialidadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activo: nuevoEstado }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || `Error al ${verbo}.`);
      }

      mostrarAlerta(`Especialidad ${verbo === 'activar' ? 'activada' : 'desactivada'} correctamente.`, 'success');

      // Actualizar la tabla dinámicamente
      actualizarFilaTabla(especialidadId, { activo: nuevoEstado });

      // Actualizar los botones dentro del modal
      if (nuevoEstado) { // Si se activó
        btnActivar.classList.add('d-none');
        btnDesactivar.classList.remove('d-none');
      } else { // Si se desactivó
        btnDesactivar.classList.add('d-none');
        btnActivar.classList.remove('d-none');
      }
    } catch (error) {
      mostrarAlerta(error.message, 'danger');
    } finally {
      // Restaurar el texto del botón presionado inmediatamente
      botonPresionado.innerHTML = originalButtonHtml;
      // Mantener ambos botones deshabilitados por 1.5 segundos
      setTimeout(() => {
        btnActivar.disabled = false;
        btnDesactivar.disabled = false;
      }, 1500); // 1.5 segundos de cooldown
    }
  };

  // Al hacer clic en los botones, se ejecuta el cambio de estado directamente.
  btnActivar.addEventListener('click', (event) => {
    const nuevoEstado = btnActivar.getAttribute('data-nuevo-estado') === 'true';
    cambiarEstado(nuevoEstado, event.currentTarget);
  });

  btnDesactivar.addEventListener('click', (event) => {
    const nuevoEstado = btnDesactivar.getAttribute('data-nuevo-estado') === 'true';
    cambiarEstado(nuevoEstado, event.currentTarget);
  });
});