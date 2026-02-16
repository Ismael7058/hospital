const { Admision, EstudioSolicitado } = require('../db/models');

exports.registrarEstudioSolicitado = async (admision_id, estudio, descripcion) => {
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
    throw new Error('La admision no permite nuevos registros de estudios solicitados');
  }

  const nuevoEstudio = await EstudioSolicitado.crete({
    estudio: estudio,
    descripcion: descripcion,
    fecha_hora: new Date(),
    activo: true,
    admision_id: admision_id
  });

  return nuevoEstudio;
};
