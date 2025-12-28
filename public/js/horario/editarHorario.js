document.addEventListener('DOMContentLoaded', () => {
  const modalEditar = document.getElementById('modalEditarHorario');
  if (!modalEditar) return;

  const form = document.getElementById('formEditarHorario');
  const errorContainer = modalEditar.querySelector('.alert-danger');
  
  const idInput = document.getElementById('edit_id');
  const fechaInput = document.getElementById('fechaInputEdit');
  const horaInicioInput = document.getElementById('horaInicioEdit');
  const horaFinInput = document.getElementById('horaFinEdit');

  modalEditar.addEventListener('show.bs.modal', async (event) => {
    const button = event.relatedTarget;
    const id = button.getAttribute('data-id');
    
    form.reset();
    form.classList.remove('was-validated');
    errorContainer.classList.add('d-none');
    errorContainer.textContent = '';
    
    try {
        // Pedir los datos del horario al servidor
        const response = await fetch(`/api/horarios/${id}`);
        
        if(!response.ok) {
            throw new Error('No se pudo cargar la información del horario.');
        }
        
        const data = await response.json();
        const horario = data.horario;

        idInput.value = horario.id;
        fechaInput.value = horario.fecha;
        horaInicioInput.value = horario.hora_inicio;
        horaFinInput.value = horario.hora_fin;
        
    } catch (error) {
        console.error(error);
        errorContainer.textContent = 'Error al cargar los datos. Intente nuevamente.';
        errorContainer.classList.remove('d-none');
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }
    
    const id = idInput.value;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    if (data.hora_inicio >= data.hora_fin) {
        errorContainer.textContent = 'La hora de inicio debe ser anterior a la hora de fin.';
        errorContainer.classList.remove('d-none');
        return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Guardando...';

    try {
        const response = await fetch(`/api/horarios/${id}/edit`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if(response.ok) {
            const bootstrapModal = bootstrap.Modal.getInstance(modalEditar);
            bootstrapModal.hide();
            mostrarAlerta('Horario modificado exitosamente.', 'success');
            setTimeout(() => {
              window.location.reload();
            }, 1000);
        } else {
            errorContainer.textContent = result.message || 'Error al actualizar el horario.';
            errorContainer.classList.remove('d-none');
        }
    } catch (error) {
        console.error(error);
        errorContainer.textContent = 'Error de conexión con el servidor.';
        errorContainer.classList.remove('d-none');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
  });
});
