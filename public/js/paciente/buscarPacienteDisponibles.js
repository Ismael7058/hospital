document.addEventListener('DOMContentLoaded', () => { 

  // Inicialización de Select2 para Pacientes
  $('#select-paciente').select2({
    theme: 'bootstrap-5',
    placeholder: 'Busque un paciente por nombre, apellido o nro de indentificacion...',
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
            text: `${item.nombre} ${item.apellido} (${doc.tipo_doc}: ${doc.nro_doc})`,
            sexo: item.sexo
          };
        })
      }),
      cache: true
    }
  });

  const btnLimpiar = document.getElementById('btn-limpiar-paciente');
  if (btnLimpiar) {
    btnLimpiar.addEventListener('click', function() {
      $('#select-paciente').val(null).trigger('change').trigger('select2:unselect');
    });
  }

});