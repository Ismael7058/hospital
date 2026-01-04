let modalEliminarInstance;
let idEliminar = null;
let nuevoEstado = null;

document.addEventListener('DOMContentLoaded', function() {
    modalEliminarInstance = new bootstrap.Modal(document.getElementById('modalEliminarAntecedente'));
    
    document.getElementById('btnConfirmarEliminar').addEventListener('click', async () => {
        if (!idEliminar) return;
        try {
            const response = await fetch(`/api/antecentes-paciente/${idEliminar}/activo`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ activo: nuevoEstado })
            });
            if (response.ok) window.location.reload();
        } catch (e) { console.error(e); }
    });
});

function eliminarAntecedente(id, estado) {
    idEliminar = id;
    nuevoEstado = estado;

    const btnConfirmar = document.getElementById('btnConfirmarEliminar');
    const modalTitle = document.querySelector('#modalEliminarAntecedente .modal-title');
    const modalBody = document.querySelector('#modalEliminarAntecedente .modal-body p');

    if (estado) {
        btnConfirmar.textContent = 'Activar';
        btnConfirmar.className = 'btn btn-info text-white';
        modalTitle.textContent = 'Confirmar Activación';
        modalBody.textContent = '¿Desea reactivar este antecedente?';
    } else {
        btnConfirmar.textContent = 'Eliminar';
        btnConfirmar.className = 'btn btn-danger';
        modalTitle.textContent = 'Confirmar Eliminación';
        modalBody.textContent = '¿Está seguro de eliminar este antecedente?';
    }

    modalEliminarInstance.show();
}
