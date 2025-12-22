document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formRegistrarAgenda');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                mostrarAlerta(result.message || 'Agenda registrada correctamente', 'success');
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                if (result.errors) {
                    const msg = result.errors.map(e => e.msg).join('\n');
                    mostrarAlerta(msg, 'danger');
                } else {
                    mostrarAlerta(result.message || 'Error al registrar la agenda', 'danger');
                }
            }
        } catch (error) {
            console.error(error);
            mostrarAlerta('Error de conexión con el servidor', 'danger');
        }
    });
});