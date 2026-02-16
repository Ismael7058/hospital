document.addEventListener('DOMContentLoaded', () => {
  const alaSelect = document.getElementById('ala_id');
  const habitacionSelect = document.getElementById('habitacion_id');
  const camaSelect = document.getElementById('cama_id');

  if (!alaSelect || !habitacionSelect) return;

  alaSelect.addEventListener('change', async (event) => {
    const alaId = event.target.value;
    habitacionSelect.innerHTML = '<option value="">Seleccionar Habitación</option>';
    habitacionSelect.disabled = true;
    
    if (camaSelect) {
      camaSelect.innerHTML = '<option value="">Seleccione Habitación primero</option>';
      camaSelect.disabled = true;
    }

    if (!alaId) return;

    try {
      const response = await fetch(`/api/infraestructura/habitacion/disponible?ala_id=${alaId}&sexo=`);
      
      if (!response.ok) throw new Error('Error al obtener habitaciones');

      const habitaciones = await response.json();

      habitaciones.forEach(habitacion => {
        const option = document.createElement('option');
        option.value = habitacion.id;
        option.textContent = `Habitación ${habitacion.numero}`; 
        habitacionSelect.appendChild(option);
      });

      habitacionSelect.disabled = false;

    } catch (error) {
      console.error('Error cargando habitaciones:', error);
      mostrarAlerta('Hubo un problema al cargar las habitaciones disponibles.', 'danger');
    }
  });

  if (camaSelect) {
    habitacionSelect.addEventListener('change', async (event) => {
      const habitacionId = event.target.value;
      
      camaSelect.innerHTML = '<option value="">Seleccionar Cama</option>';
      camaSelect.disabled = true;

      if (!habitacionId) return;

      try {
        const response = await fetch(`/api/infraestructura/cama?habitacion_id=${habitacionId}&estado=Libre`);
        
        if (!response.ok) throw new Error('Error al obtener camas');
        
        const camas = await response.json();
        
        camas.forEach(cama => {
          const option = document.createElement('option');
          option.value = cama.id;
          option.textContent = cama.codigo || `Cama ${cama.codigo}`;
          camaSelect.appendChild(option);
        });

        camaSelect.disabled = false;
      } catch (error) {
        console.error('Error cargando camas:', error);
      }
    });
  }
});
