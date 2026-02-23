document.addEventListener('DOMContentLoaded', () => { 

  // Inicialización de Select2 para Usuarios
  $('#select-medico').select2({
    theme: 'bootstrap-5',
    placeholder: 'Busque un usuario por DNI, nombre o apellido...',
    language: "es",
    ajax: {
      url: '/api/usuarios/buscar-medicos',
      dataType: 'json',
      delay: 250,
      data: (params) => ({
        q: params.term
      }),
      processResults: (data) => ({
        results: $.map(data, (item) => ({
          id: item.id,
          text: `${item.nombre} ${item.apellido} (DNI: ${item.dni})`
        }))
      }),
      cache: true
    }
  });

  const btnLimpiar = document.getElementById('btn-limpiar-medico');
  if (btnLimpiar) {
    btnLimpiar.addEventListener('click', function() {
      $('#select-medico').val(null).trigger('change').trigger('select2:unselect');
    });
  }

});