document.addEventListener('DOMContentLoaded', () => {
  const modalAtender = document.getElementById('modalAtenderAdmision');
  if (!modalAtender) return;
  const form = document.getElementById('formAtenderAdmision');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const admisionId = form.querySelector('input[name="admision_id"]').value;

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Procesando...';

    try {
      const response = await fetch(`/api/admisiones/${admisionId}/atender`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify()
      });

      const result = await response.json();

      if (response.ok) {
        bootstrap.Modal.getInstance(modalAtender).hide();
        mostrarAlerta(result.message || 'Atencion realizada con éxito', 'success');
        setTimeout(() => {window.location.reload();}, 1000);
      } else {
        const msg = result.errors ? result.errors.map(e => e.msg).join('. ') : (result.message || 'Error al realizar la atencion');
        mostrarAlerta(msg, 'danger');
      }
    } catch (error) {
      console.error('Error:', error);
      mostrarAlerta('Error de conexión con el servidor.', 'danger');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
});