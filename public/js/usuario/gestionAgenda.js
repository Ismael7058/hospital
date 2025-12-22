document.addEventListener('DOMContentLoaded', function() {
  const calendarioEl = document.getElementById('calendario');

  if (calendarioEl) {
    const calendar = new FullCalendar.Calendar(calendarioEl, {
      initialView: 'dayGridMonth', // Vista mensual por defecto
      locale: 'es', // Idioma español
      contentHeight: 'auto',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,listWeek'
      },
      events: typeof eventos !== 'undefined' ? eventos : [], // Carga los eventos desde la variable global
      eventColor: '#dc3545' // Color rojo para los eventos de ausencia
    });

    calendar.render();
  }

  // --- Lógica para el Modal de Editar Agenda ---
  const modalEditar = document.getElementById('modalEditarAgenda');
  if (modalEditar) {
    modalEditar.addEventListener('show.bs.modal', function (event) {
      const button = event.relatedTarget;
      const id = button.getAttribute('data-id');
      const fechaInicio = button.getAttribute('data-fecha-inicio');
      const fechaFin = button.getAttribute('data-fecha-fin');
      const motivo = button.getAttribute('data-motivo');

      // Función auxiliar para formatear fecha a YYYY-MM-DD
      const formatFecha = (fechaStr) => {
        if (!fechaStr) return '';
        const date = new Date(fechaStr);
        return date.toISOString().split('T')[0];
      };

      // Rellenar campos
      modalEditar.querySelector('#edit_id').value = id;
      modalEditar.querySelector('#edit_fecha_inicio').value = formatFecha(fechaInicio);
      modalEditar.querySelector('#edit_fecha_fin').value = formatFecha(fechaFin);
      modalEditar.querySelector('#edit_motivo').value = motivo || '';

      // Actualizar action del formulario (ajusta la ruta según tu API)
      modalEditar.querySelector('#formEditarAgenda').action = `/api/agendas/${id}?_method=PUT`;
    });
  }

  // --- Lógica para el Modal de Estado (Alta/Baja) ---
  const modalEstado = document.getElementById('modalEstadoAgenda');
  if (modalEstado) {
    modalEstado.addEventListener('show.bs.modal', function (event) {
      const button = event.relatedTarget;
      const id = button.getAttribute('data-id');
      const esActivo = button.getAttribute('data-activo') === 'true';

      const form = modalEstado.querySelector('#formEstadoAgenda');
      const btn = modalEstado.querySelector('#btnConfirmarEstado');
      const mensaje = modalEstado.querySelector('#mensajeEstado');
      const inputActivo = modalEstado.querySelector('#estado_activo');

      // Configurar ruta (ajusta la ruta según tu API)
      form.action = `/api/agendas/${id}/activo?_method=PATCH`;

      if (esActivo) {
        mensaje.textContent = "¿Estás seguro de que deseas dar de baja esta agenda?";
        btn.className = 'btn btn-danger';
        btn.textContent = 'Dar de Baja';
        inputActivo.value = 'false';
      } else {
        mensaje.textContent = "¿Estás seguro de que deseas activar esta agenda?";
        btn.className = 'btn btn-success';
        btn.textContent = 'Activar';
        inputActivo.value = 'true';
      }
    });
  }
});
