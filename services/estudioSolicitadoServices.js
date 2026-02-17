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

exports.setActivo = async (id, activo) => {
  const estudio = await EstudioSolicitado.findByPk(id, {
    include: [
      {
        model: Admision,
        as: 'admision'
      }
    ]
  });
  if (!estudio) {
    throw new Error('Estudio solicitado no encontrada');
  }

  if (estudio.activo === activo) {
    throw new Error(`El estudio solicitado ya se encuentra ${activo ? 'activo' : 'inactivo'}.`);
  }

  if (estudio.admision.estado_atencion != 'En Espera') {
    throw new Error('El estudio solicitado no puede cambiar su estado activo');
  }

  estudio.activo = activo;
  await estudio.save();
}