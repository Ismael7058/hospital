document.addEventListener('DOMContentLoaded', () => {
  const modalRegistrar = document.getElementById('modalRegistrarPacienteSeguro');
  if (!modalRegistrar) return;

  const form = document.getElementById('formRegistrarPacienteSeguro');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Guardando...`;

    try {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

      const response = await fetch('/api/paciente-seguros/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result && Array.isArray(result.errors)) {
          result.errors.forEach(err => mostrarAlerta(err.msg, 'danger'));
        } else {
          mostrarAlerta(result.message || 'Ocurrió un error al renovar el seguro.', 'danger');
        }
      } else {
        mostrarAlerta(result.message, 'success');
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (error) {
      mostrarAlerta('Error de conexión. No se pudo completar la solicitud.', 'danger');
    } finally {
      setTimeout(() => {
        submitBtn.disabled = false
        submitBtn.innerHTML = originalBtnText
      }, 1000);

    }
  });
});
