document.addEventListener('DOMContentLoaded', () => {
    const modalEstado = document.getElementById('modalEstadoHorario');
    if (!modalEstado) return;

    const form = document.getElementById('formEstadoHorario');
    const idInput = document.getElementById('estado_horario_id');
    const activoInput = document.getElementById('estado_horario_activo');
    const mensajeP = document.getElementById('mensajeEstadoHorario');
    const errorContainer = document.getElementById('error-container-estado');
    const btnConfirmar = document.getElementById('btnConfirmarEstado');

    modalEstado.addEventListener('show.bs.modal', (event) => {
        const button = event.relatedTarget;
        
        // Obtener datos del botón que abrió el modal
        const id = button.getAttribute('data-id');
        const activoActual = button.getAttribute('data-activo') === 'true';
        
        // Calcular nuevo estado (invertir el actual)
        const nuevoEstado = !activoActual;
        const accionTexto = nuevoEstado ? 'activar' : 'desactivar';

        idInput.value = id;
        activoInput.value = nuevoEstado;

        // Actualizar texto del modal
        mensajeP.textContent = `¿Está seguro de que desea ${accionTexto} este horario?`;
        
        // Limpiar errores previos
        errorContainer.classList.add('d-none');
        errorContainer.textContent = '';
        
        // Resetear botón
        btnConfirmar.disabled = false;
        btnConfirmar.innerHTML = 'Confirmar';
        
        // Cambiar estilo del botón según la acción para mejor UX
        btnConfirmar.className = `btn ${nuevoEstado ? 'btn-success' : 'btn-danger'}`;
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const id = idInput.value;
        const activo = activoInput.value === 'true'; 

        // Estado de carga
        const originalBtnText = btnConfirmar.innerHTML;
        btnConfirmar.disabled = true;
        btnConfirmar.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Procesando...';

        try {
            const response = await fetch(`/api/horarios/${id}/activo`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ activo: activo })
            });

            const result = await response.json();

            if (response.ok) {
                mostrarAlerta('Edtado del horario modificado exitosamente.', 'success');
                setTimeout(() => {
                window.location.reload();
                }, 1000);
            } else {
                throw new Error(result.message || 'Error al cambiar el estado del horario.');
            }
        } catch (error) {
            errorContainer.textContent = error.message;
            errorContainer.classList.remove('d-none');
            btnConfirmar.disabled = false;
            btnConfirmar.innerHTML = originalBtnText;
        }
    });
});
