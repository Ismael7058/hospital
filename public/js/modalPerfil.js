document.addEventListener('DOMContentLoaded', function () {
  const perfilModalElement = document.getElementById('perfilUsuarioModal');
  if (!perfilModalElement) return;
  // Escuchamos el evento 'hidden.bs.modal' que Bootstrap dispara cuando el modal se ha terminado de ocultar.
  perfilModalElement.addEventListener('hidden.bs.modal', function () {
    // Buscamos TODOS los formularios dentro del modal
    const forms = perfilModalElement.querySelectorAll('form');

    forms.forEach(form => {
      // 1. Reseteamos el formulario para limpiar los valores de los inputs
      form.reset();

      // 2. Eliminamos las clases de error y los mensajes de feedback
      form.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
      form.querySelectorAll('.invalid-feedback').forEach(el => el.remove());
    });
  });
});
