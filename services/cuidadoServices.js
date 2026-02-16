const { Admision, CuidadoPreliminar } = require('../db/models');

exports.registrarCuidado = async (admision_id, descripcion) => {
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

  const nuevoCuidado = await CuidadoPreliminar.crete({
    descripcion: descripcion,
    fecha_hora: new Date(),
    activo: true,
    admision_id: admision_id
  });

  return nuevoCuidado;
};

exports.setActivo = async (id, activo) => {
  const cuidado = await CuidadoPreliminar.findByPk(id, {
    include: [
      {
        model: Admision,
        as: 'admision'
      }
    ]
  });
  if (!cuidado) {
    throw new Error('Cuidado preeliminar no encontrada');
  }

  if (cuidado.activo === activo) {
    throw new Error(`El cuidado preeliminar ya se encuentra ${activo ? 'activa' : 'inactiva'}.`);
  }

  if (cuidado.admision.estado_atencion != 'En Espera') {
    throw new Error('El cuidado preeliminar no puede cambiar su estado activo');
  }

  cuidado.activo = activo;
  await cuidado.save();
}