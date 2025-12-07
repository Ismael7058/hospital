document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formAla');
  if (!form) return;

  const modalElement = document.getElementById('modalAla');
  const modal = new bootstrap.Modal(modalElement);
  const submitButton = modalElement.querySelector('button[type="submit"]');
  const nombreInput = document.getElementById('alaNombre');
  const idInput = document.getElementById('alaId');
  const modalLabel = document.getElementById('modalAlaLabel');

  let filaEditada = null;

  modalElement.addEventListener('show.bs.modal', (event) => {
    const button = event.relatedTarget;
    const id = button.getAttribute('data-id');

    if (id) {
      // Modo Edición
      modalLabel.textContent = 'Editar Ala';
      idInput.value = id;
      nombreInput.value = button.getAttribute('data-nombre');
      filaEditada = button.closest('tr');
    } else {
      modalLabel.textContent = 'Registrar Nueva Ala';
      filaEditada = null;
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Guardando...`; // lgtm [js/inner-html-manipulation]

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      const url = data.id ? `/api/infraestructura/ala/${data.id}/edit` : '/api/infraestructura/ala/register';
      const method = data.id ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: data.nombre })
      });

      const result = await response.json();

      if (response.ok) {
        mostrarAlerta(result.message, 'success');
        modal.hide();

        if (method === 'PATCH' && filaEditada) {
          filaEditada.cells[1].textContent = data.nombre;
        } else {
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
      } else {
        mostrarAlerta(result.message || 'Ocurrió un error.', 'danger');
      }
    } catch (error) {
      console.error('Error al registrar/editar el ala:', error);
      mostrarAlerta('No se pudo conectar con el servidor.', 'danger');
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;
    }
  });

  modalElement.addEventListener('hidden.bs.modal', () => {
    clearErrors();
    form.reset();
    idInput.value = '';
    filaEditada = null;
  });

  const validateForm = () => {
    clearErrors();
    let isValid = true;

    if (nombreInput.value.trim() === '') {
      showError(nombreInput, 'El nombre del ala es obligatorio.');
      isValid = false;
    }

    return isValid;
  };

  const showError = (input, message) => {
    input.classList.add('is-invalid');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;
    input.parentElement.appendChild(errorDiv);
  };

  const clearErrors = () => {
    document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    document.querySelectorAll('.invalid-feedback').forEach(el => el.remove());
  };
});
