document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formEstadoAgenda');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Obtenemos la URL base desde el action que configuró gestionAgenda.js
        const actionUrl = new URL(form.action, window.location.origin);
        const url = actionUrl.pathname;

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Convertir el valor "true"/"false" a booleano
        data.activo = data.activo === 'true';

        try {
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                mostrarAlerta(result.message || 'Estado actualizado correctamente', 'success');
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                mostrarAlerta(result.message || 'Error al cambiar el estado de la agenda', 'danger');
            }
        } catch (error) {
            console.error(error);
            mostrarAlerta('Error de conexión con el servidor', 'danger');
        }
    });
});