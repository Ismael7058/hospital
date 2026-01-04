let modalValidarInstance;
let idValidar = null;
let estadoValidar = null;

document.addEventListener('DOMContentLoaded', function() {
    modalValidarInstance = new bootstrap.Modal(document.getElementById('modalValidarAntecedente'));
    
    document.getElementById('btnConfirmarValidar').addEventListener('click', async () => {
        if (!idValidar) return;
        try {
            const response = await fetch(`/api/antecentes-paciente/${idValidar}/validado`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ validado: estadoValidar })
            });
            if (response.ok) window.location.reload();
        } catch (e) { console.error(e); }
    });
});

function cambiarValidacion(id, estado) {
    idValidar = id;
    estadoValidar = estado;

    const btnConfirmar = document.getElementById('btnConfirmarValidar');
    const modalTitle = document.querySelector('#modalValidarAntecedente .modal-title');
    const modalBody = document.querySelector('#modalValidarAntecedente .modal-body p');

    if (estado) {
        btnConfirmar.textContent = 'Validar';
        btnConfirmar.className = 'btn btn-success';
        modalTitle.textContent = 'Confirmar Validación';
        modalBody.textContent = '¿Desea marcar este antecedente como validado médicamente?';
    } else {
        btnConfirmar.textContent = 'Invalidar';
        btnConfirmar.className = 'btn btn-warning';
        modalTitle.textContent = 'Confirmar Invalidación';
        modalBody.textContent = '¿Desea quitar la validación de este antecedente?';
    }

    modalValidarInstance.show();
}
