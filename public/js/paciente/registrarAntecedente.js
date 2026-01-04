document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('formRegistrarAntecedente');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        data.validado = form.querySelector('input[name="validado"]').checked;

        try {
            const response = await fetch('/api/antecentes-paciente/registrar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                window.location.reload();
            } else {
                const err = await response.json();
                mostrarAlerta(err.message || 'Error al guardar', 'danger');
            }
        } catch (error) {
            mostrarAlerta('Error de conexión', 'danger');
        }
    });
});
