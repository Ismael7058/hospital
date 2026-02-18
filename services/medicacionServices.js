const { Admision, Medicacion } = require('../db/models');

exports.registrarMedicacion = async (datosMedicacion) => {
  const { admision_id, medicamento, descripcion, intervalo_horas, via_administracion_id } = datosMedicacion;
  const admision = await Admision.findByPk(admision_id);
  if (!admision) {
    throw new Error('Admision no encontrado');
  }
  if (!admision.activo)
    {
    throw new Error('La admision no se encuentra disponible');
  }
  if (admision.estado_atencion != 'En Atencion')
    {
    throw new Error('La admision no permite nuevos registros de medicaciones');
  }

  const nuevaMedicacion = await Medicacion.crete({
    medicamento: medicamento,
    descripcion: descripcion,
    intervalo_horas: intervalo_horas,
    fecha_hora: new Date(),
    activo: true,
    estado: 'Suministrar',
    admision_id: admision_id,
    via_administracion_id: via_administracion_id
  });

  return nuevaMedicacion;
};

exports.setActivo = async (id, activo) => {
  const medicacion = await Medicacion.findByPk(id, {
    include: [
      {
        model: Admision,
        as: 'admision'
      }
    ]
  });
  if (!medicacion) {
    throw new Error('Medicacion no encontrada');
  }

  if (medicacion.activo === activo) {
    throw new Error(`La medicacion ya se encuentra ${activo ? 'activa' : 'inactiva'}.`);
  }

  if (medicacion.admision.estado_atencion != 'En Espera') {
    throw new Error('La medicacion no puede cambiar su estado activo');
  }

  medicacion.activo = activo;
  await medicacion.save();
}