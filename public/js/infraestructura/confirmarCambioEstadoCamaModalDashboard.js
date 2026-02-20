  function actualizarUIDashboard(button, nuevoEstado, camaId) {
    const icon = button.querySelector('i');
    if (!icon) return;

    let newColorClass = '', newTitle = '', newAccionTexto = '', newTituloModal = '', nextEstado = '';

    if (nuevoEstado === 'Higienizando') {
        newColorClass = 'text-warning';
        newTitle = 'Finalizar Higienización';
        newAccionTexto = 'finalizar la higienización y marcar la cama como libre';
        newTituloModal = 'Confirmar Finalización';
        nextEstado = 'Libre';
    } else if (nuevoEstado === 'Libre') {
        newColorClass = 'text-success';
        newTitle = 'Higienizar Cama';
        newAccionTexto = 'iniciar la higienización de esta cama';
        newTituloModal = 'Confirmar Higienización';
        nextEstado = 'Higienizando';
    } else {
      return;
    }

    icon.className = 'bi bi-square-fill';
    icon.classList.add(newColorClass);

    button.setAttribute('data-nuevo-estado', nextEstado);
    button.setAttribute('data-accion-texto', newAccionTexto);
    button.setAttribute('data-titulo', newTituloModal);
    button.setAttribute('title', newTitle);

    const tooltip = bootstrap.Tooltip.getInstance(button);
    if (tooltip) tooltip.dispose();
    new bootstrap.Tooltip(button);
  }