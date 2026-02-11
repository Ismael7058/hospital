document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('admitirPorTurno');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Guardando...';

      try {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        const response = await fetch('/api/admisiones/registrar?modo=turno', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          window.location.href = '/admisiones';
        } else {
          const result = await response.json();
          mostrarAlerta(result.message || 'Ocurrió un error al registrar la admisión.', 'danger');
        }
      } catch (error) {
        mostrarAlerta('Error de conexión con el servidor.', 'danger');
      } finally {
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }, 1000);
      }
    });
  }
});
