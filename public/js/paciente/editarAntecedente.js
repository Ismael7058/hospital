let modalEditarInstance;

document.addEventListener('DOMContentLoaded', function() {
    const modalElement = document.getElementById('modalEditarAntecedente');
    modalEditarInstance = new bootstrap.Modal(modalElement);
    const form = document.getElementById('formEditarAntecedente');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('edit_antecedenteId').value;
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        data.validado = document.getElementById('edit_validado').checked;

        try {
            const response = await fetch(`/api/antecentes-paciente/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                window.location.reload();
            } else {
                const err = await response.json();
                alert('Error: ' + (err.message || 'Error al actualizar'));
            }
        } catch (error) {
            console.error(error);
            alert('Error de conexión');
        }
    });
});

function cargarDatosModal(antecedente) {
    document.getElementById('edit_antecedenteId').value = antecedente.id;
    document.getElementById('edit_descripcion').value = antecedente.descripcion;
    document.getElementById('edit_fecha_registro').value = antecedente.fecha_registro;
    document.getElementById('edit_observaciones').value = antecedente.observaciones || '';
    document.getElementById('edit_tipo_antecedente_id').value = antecedente.tipo_antecedente_id;
    document.getElementById('edit_fuente_informacion_id').value = antecedente.fuente_informacion_id;
    document.getElementById('edit_validado').checked = antecedente.validado;
    
    if (modalEditarInstance) modalEditarInstance.show();
}
