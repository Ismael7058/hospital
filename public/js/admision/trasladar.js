document.addEventListener('DOMContentLoaded', () => {
  const modalTraslado = document.getElementById('modalTraslado');
  if (!modalTraslado) return;
  const form = document.getElementById('formTrasladoPaciente');
  const alaSelect = document.getElementById('ala_id');
  const habitacionSelect = document.getElementById('habitacion_id');
  const camaSelect = document.getElementById('cama_id');
  
  const sexoInput = form.querySelector('input[name="sexoPaciente"]');
  const sexo = sexoInput?.value;

  // Helper para manejar el estado de los selects
  const setSelectState = (select, placeholder, options = [], disabled = true) => {
    if (!select) return;
    select.disabled = disabled;
    select.innerHTML = `<option value="">${placeholder}</option>` + 
      options.map(opt => `<option value="${opt.value}">${opt.text}</option>`).join('');
  };

  // Función genérica para cargar opciones desde la API
  const cargarOpciones = async (url, select, placeholder, mapFunc) => {
    setSelectState(select, 'Cargando...', [], true);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error();
      const data = await res.json();
      const options = data.length ? data.map(mapFunc) : [];
      const msg = data.length ? placeholder : `No hay ${placeholder.split(' ')[1].toLowerCase()}s disponibles`;
      setSelectState(select, msg, options, !data.length);
    } catch (error) {
      console.error(error);
      setSelectState(select, 'Error al cargar', [], true);
      if (typeof mostrarAlerta === 'function') mostrarAlerta('Error al cargar datos.', 'danger');
    }
  };

  const cargarAlas = () => {
    setSelectState(habitacionSelect, 'Seleccione Ala primero', [], true);
    setSelectState(camaSelect, 'Seleccione Habitación primero', [], true);
    if (!sexo) return setSelectState(alaSelect, 'Error: Sexo no definido', [], true);
    
    cargarOpciones(
      `/api/infraestructura/ala/disponibles?sexo=${encodeURIComponent(sexo)}`,
      alaSelect, 'Seleccionar Ala',
      item => ({ value: item.id, text: item.nombre })
    );
  };

  const cargarHabitaciones = (alaId) => {
    setSelectState(camaSelect, 'Seleccione Habitación primero', [], true);
    if (!alaId) return setSelectState(habitacionSelect, 'Seleccione Ala primero', [], true);

    cargarOpciones(
      `/api/infraestructura/habitacion/disponible?ala_id=${alaId}&sexo=${sexo}`,
      habitacionSelect, 'Seleccionar Habitación',
      item => ({ value: item.id, text: `Habitación ${item.numero}` })
    );
  };

  const cargarCamas = (habitacionId) => {
    if (!habitacionId) return setSelectState(camaSelect, 'Seleccione Habitación primero', [], true);

    cargarOpciones(
      `/api/infraestructura/cama?habitacion_id=${habitacionId}&estado=Libre`,
      camaSelect, 'Seleccionar Cama',
      item => ({ value: item.id, text: item.codigo || `Cama ${item.id}` })
    );
  };

  // Listeners
  alaSelect.addEventListener('change', (e) => cargarHabitaciones(e.target.value));
  habitacionSelect.addEventListener('change', (e) => cargarCamas(e.target.value));

  if (sexo) cargarAlas();

  // Resetear selects al cerrar modal
  modalTraslado.addEventListener('hidden.bs.modal', () => {
    form.reset();
    setSelectState(habitacionSelect, 'Seleccione Ala primero', [], true);
    setSelectState(camaSelect, 'Seleccione Habitación primero', [], true);
    if (sexo) cargarAlas();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const admisionId = form.querySelector('input[name="admision_id"]').value;
    const camaId = camaSelect.value;

    if (!camaId) return mostrarAlerta('Por favor, seleccione una cama válida.', 'warning');

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Procesando...';

    try {
      const response = await fetch(`/api/admisiones/${admisionId}/cama`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cama_id: parseInt(camaId) })
      });

      const result = await response.json();

      if (response.ok) {
        bootstrap.Modal.getInstance(modalTraslado).hide();
        mostrarAlerta(result.message || 'Traslado realizado con éxito', 'success');
        setTimeout(() => {window.location.reload();}, 1000);
      } else {
        const msg = result.errors ? result.errors.map(e => e.msg).join('. ') : (result.message || 'Error al realizar el traslado');
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
