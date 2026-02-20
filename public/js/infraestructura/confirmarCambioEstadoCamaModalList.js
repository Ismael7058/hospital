  function actualizarUITabla(button, nuevoEstado, camaId) {
    const fila = button.closest('tr');
    if (!fila) return;
    
    const badge = fila.cells[3].querySelector('.badge');

    badge.textContent = nuevoEstado;
    badge.className = 'badge';
    if (nuevoEstado === 'Libre') badge.classList.add('bg-success');
    else if (nuevoEstado === 'Higienizando') badge.classList.add('bg-warning', 'text-dark');
    else if (nuevoEstado === 'Ocupado') badge.classList.add('bg-danger');

    const buttonContainer = button.parentElement;
    const toggleActivoBtn = buttonContainer.querySelector('.btn-toggle-activo');
    
    button.remove();

    let newButton;
    if (nuevoEstado === 'Libre') {
      newButton = createActionButton(camaId, 'Higienizando', 'iniciar la higienización de esta cama', 'Confirmar Higienización', 'btn-outline-warning', 'Higienizar Cama', 'bi-droplet');
    } else if (nuevoEstado === 'Higienizando') {
      newButton = createActionButton(camaId, 'Libre', 'finalizar la higienización y marcar la cama como libre', 'Confirmar Finalización', 'btn-outline-success', 'Finalizar Higienización', 'bi-check-circle');
    } else {
      newButton = createDisabledButton();
    }
    
    buttonContainer.insertBefore(newButton, toggleActivoBtn);
  }

  function createActionButton(camaId, nuevoEstado, accionTexto, titulo, btnClase, title, iconClass) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `btn btn-sm ${btnClase}`;
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#confirmarCambioEstadoCamaModal');
    button.setAttribute('data-cama-id', camaId);
    button.setAttribute('data-nuevo-estado', nuevoEstado);
    button.setAttribute('data-accion-texto', accionTexto);
    button.setAttribute('data-titulo', titulo);
    button.setAttribute('data-btn-clase', btnClase);
    button.title = title;
    button.innerHTML = `<i class="bi ${iconClass}"></i>`;
    return button;
  }

  function createDisabledButton() {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn btn-sm btn-outline-secondary';
    button.disabled = true;
    button.title = 'Acción no disponible';
    button.setAttribute('data-bs-toggle', 'tooltip');
    button.innerHTML = '<i class="bi bi-droplet"></i>';
    new bootstrap.Tooltip(button);
    return button;
  }