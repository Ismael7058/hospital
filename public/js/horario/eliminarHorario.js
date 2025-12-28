document.addEventListener('DOMContentLoaded', () => {
    const modalEliminar = document.getElementById('modalEliminarHorario');
    if (!modalEliminar) return;

    const form = document.getElementById('formEliminarHorario');
    const idInput = document.getElementById('eliminar_horario_id');
    const errorContainer = document.getElementById('error-container-eliminar');
    const btnConfirmar = document.getElementById('btnConfirmarEliminar');

    modalEliminar.addEventListener('show.bs.modal', (event) => {
        const button = event.relatedTarget;
        const id = button.getAttribute('data-id');
        
        idInput.value = id;

        errorContainer.classList.add('d-none');
        errorContainer.textContent = '';
        btnConfirmar.disabled = false;
        btnConfirmar.innerHTML = 'Eliminar';
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const id = idInput.value;

        const originalBtnText = btnConfirmar.innerHTML;
        btnConfirmar.disabled = true;
        btnConfirmar.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Eliminando...';

        try {
            const response = await fetch(`/api/horarios/${id}/eliminar`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();

            if (response.ok) {
              mostrarAlerta('Horario eliminado exitosamente.', 'success');
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            } else {
                throw new Error(result.message || 'Error al eliminar el horario.');
            }
        } catch (error) {
            errorContainer.textContent = error.message;
            errorContainer.classList.remove('d-none');
            btnConfirmar.disabled = false;
            btnConfirmar.innerHTML = originalBtnText;
        }
    });
});
