document.addEventListener('DOMContentLoaded', () => { 
  const modalElement = document.getElementById('modalRegistrarAdmision');
  const form = document.getElementById('formRegistrarAdmision');

  // === Inicialización de Select2 para Pacientes ===
  $('#modal-select-paciente').select2({
    theme: 'bootstrap-5',
    dropdownParent: $('#modalRegistrarAdmision'),
    placeholder: 'Busque un paciente por nombre, apellido o DNI...',
    ajax: {
      url: '/api/pacientes/disponibles',
      dataType: 'json',
      delay: 250,
      data: (params) => ({
        q: params.term
      }),
      processResults: (data) => ({
        results: $.map(data, (item) => {
          const doc = item.identificaciones && item.identificaciones.length > 0 ? item.identificaciones[0] : { tipo_doc: 'Doc', nro_doc: 'N/A' };
          return {
            id: item.id,
            text: `${item.nombre} ${item.apellido} (${doc.tipo_doc}: ${doc.nro_doc})`
          };
        })
      }),
      cache: true
    }
  });

  if (modalElement) {
    modalElement.addEventListener('hidden.bs.modal', () => {
      form.reset();
      $('#modal-select-medico').val(null).trigger('change');
      document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
      document.querySelectorAll('.invalid-feedback').forEach(el => el.style.display = '');
    });
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      let isValid = true;
      if (!$('#modal-select-paciente').val()) {
        document.getElementById('error-paciente_id').style.display = 'block';
        isValid = false;
      } else {
        document.getElementById('error-paciente_id').style.display = 'none';
      }

      if (!isValid) return;

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Guardando...';

      try {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        const response = await fetch('/api/admisiones/registrar?modo=guardia', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          window.location.reload();
        } else {
          const result = await response.json();

          mostrarAlerta(result.message || 'Ocurrió un error al registrar la admisión.', 'danger');
        }
      } catch (error) {
        mostrarAlerta('Error de conexión con el servidor.', 'danger');
      } finally {
        setTimeout(() => submitBtn.disabled = false, 1000);
        setTimeout(() => submitBtn.innerHTML = originalBtnText, 1000);
      }
    });
  }
});