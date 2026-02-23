document.addEventListener('DOMContentLoaded', () => {
  // --- Elementos del DOM ---
  const alaSelect = document.getElementById('ala_id');
  const habitacionSelect = document.getElementById('habitacion_id');
  const camaSelect = document.getElementById('cama_id');
  const pacienteSelect = $('#select-paciente');
  const sexoTemporalSelect = document.querySelector('select[name="sexo"]');

  if (!alaSelect || !habitacionSelect) return;

  let sexoRegistrado = '';
  let sexoTemporal = sexoTemporalSelect ? sexoTemporalSelect.value : '';
  let sexoActivo = '';

  const setSelectState = (select, placeholder, options = [], disabled = true) => {
    if (!select) return;
    select.disabled = disabled;
    select.innerHTML = `<option value="">${placeholder}</option>`;
    options.forEach(opt => {
      const optionEl = document.createElement('option');
      optionEl.value = opt.value;
      optionEl.textContent = opt.text;
      select.appendChild(optionEl);
    });
  };

  const cargarAlas = async (sexo) => {
    setSelectState(alaSelect, 'Cargando alas...', [], true);
    setSelectState(habitacionSelect, 'Seleccione Ala primero', [], true);
    setSelectState(camaSelect, 'Seleccione Habitación primero', [], true);

    if (!sexo) {
      setSelectState(alaSelect, 'Seleccione un Paciente', [], true);
      return;
    }

    try {
      const response = await fetch(`/api/infraestructura/ala/disponibles?sexo=${encodeURIComponent(sexo)}`);
      if (!response.ok) throw new Error('Error al obtener alas');
      const alas = await response.json();
      
      if (alas.length > 0) {
        const options = alas.map(ala => ({ value: ala.id, text: ala.nombre }));
        setSelectState(alaSelect, 'Seleccionar Ala', options, false);
      } else {
        setSelectState(alaSelect, 'No hay alas disponibles', [], true);
      }
    } catch (error) {
      console.error('Error cargando alas:', error);
      setSelectState(alaSelect, 'Error al cargar alas', [], true);
      mostrarAlerta('Hubo un problema al cargar las alas disponibles.', 'danger');
    }
  };

  const cargarHabitaciones = async (alaId, sexo) => {
    setSelectState(habitacionSelect, 'Cargando habitaciones...', [], true);
    setSelectState(camaSelect, 'Seleccione Habitación primero', [], true);

    if (!alaId) {
      setSelectState(habitacionSelect, 'Seleccione Ala primero', [], true);
      return;
    }

    try {
      const response = await fetch(`/api/infraestructura/habitacion/disponible?ala_id=${alaId}&sexo=${sexo}`);
      if (!response.ok) throw new Error('Error al obtener habitaciones');
      const habitaciones = await response.json();

      if (habitaciones.length > 0) {
        const options = habitaciones.map(h => ({ value: h.id, text: `Habitación ${h.numero}` }));
        setSelectState(habitacionSelect, 'Seleccionar Habitación', options, false);
      } else {
        setSelectState(habitacionSelect, 'No hay habitaciones disponibles', [], true);
      }
    } catch (error) {
      console.error('Error cargando habitaciones:', error);
      setSelectState(habitacionSelect, 'Error al cargar habitaciones', [], true);
      mostrarAlerta('Hubo un problema al cargar las habitaciones.', 'danger');
    }
  };

  const cargarCamas = async (habitacionId) => {
    setSelectState(camaSelect, 'Cargando camas...', [], true);

    if (!habitacionId) {
      setSelectState(camaSelect, 'Seleccione Habitación primero', [], true);
      return;
    }

    try {
      const response = await fetch(`/api/infraestructura/cama?habitacion_id=${habitacionId}&estado=Libre`);
      if (!response.ok) throw new Error('Error al obtener camas');
      const camas = await response.json();

      if (camas.length > 0) {
        const options = camas.map(c => ({ value: c.id, text: c.codigo || `Cama ${c.id}` }));
        setSelectState(camaSelect, 'Seleccionar Cama', options, false);
      } else {
        setSelectState(camaSelect, 'No hay camas disponibles', [], true);
      }
    } catch (error) {
      console.error('Error cargando camas:', error);
      setSelectState(camaSelect, 'Error al cargar camas', [], true);
      mostrarAlerta('Hubo un problema al cargar las camas.', 'danger');
    }
  };

  const actualizarSexoYRecargar = () => {
    const nuevoSexo = sexoRegistrado || sexoTemporal;
    if (sexoActivo !== nuevoSexo) {
      sexoActivo = nuevoSexo;
      cargarAlas(sexoActivo);
    }
  };

  pacienteSelect.on('select2:select', (e) => {
    sexoRegistrado = e.params.data.sexo;
    actualizarSexoYRecargar();
  });

  pacienteSelect.on('select2:unselect', () => {
    sexoRegistrado = '';
    actualizarSexoYRecargar();
  });

  if (sexoTemporalSelect) {
    sexoTemporalSelect.addEventListener('change', (e) => { sexoTemporal = e.target.value; actualizarSexoYRecargar(); });
  }

  alaSelect.addEventListener('change', (e) => cargarHabitaciones(e.target.value, sexoActivo));
  
  if (camaSelect) {
    habitacionSelect.addEventListener('change', (e) => cargarCamas(e.target.value));
  }

  setSelectState(alaSelect, 'Seleccione un Paciente', [], true);
  setSelectState(habitacionSelect, 'Seleccione Ala primero', [], true);
  setSelectState(camaSelect, 'Seleccione Habitación primero', [], true);
});
