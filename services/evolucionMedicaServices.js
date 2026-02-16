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

  const nuevaEvolucion = await EvolucionMedica.crete({
    diagnostico: diagnostico,
    tratamiento_ajuste: tratamiento_ajuste,
    fecha_hora: new Date(),
    activo: true,
    admision_id: admision_id
  });

  return nuevaEvolucion;
};