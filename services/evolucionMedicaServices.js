const { Admision, EvolucionMedica } = require('../db/models');

exports.registrarEvolucionMedica = async (admision_id, diagnostico, tratamiento_ajuste) => {
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
    throw new Error('La admision no permite nuevos registros de evolucion medica');
  }

  const nuevaEvolucion = await EvolucionMedica.create({
    diagnostico: diagnostico,
    tratamiento_ajuste: tratamiento_ajuste,
    fecha_hora: new Date(),
    activo: true,
    admision_id: admision_id
  });

  return nuevaEvolucion;
};

exports.setActivo = async (id, activo) => {
  const evolucion = await EvolucionMedica.findByPk(id, {
    include: [
      {
        model: Admision,
        as: 'admision'
      }
    ]
  });
  if (!evolucion) {
    throw new Error('Evolucion medica no encontrada');
  }

  if (evolucion.activo === activo) {
    throw new Error(`La evolucion medica ya se encuentra ${activo ? 'activa' : 'inactiva'}.`);
  }

  if (evolucion.admision.estado_atencion != 'En Espera') {
    throw new Error('La evolucion medica no puede cambiar su estado activo');
  }

  evolucion.activo = activo;
  await evolucion.save();
}