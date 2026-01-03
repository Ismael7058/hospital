const { FuentesInformacion } = require ('../db/models');

exports.getFuente = async (id) => {
  const fuente = await FuentesInformacion.findByPk(id);
  if(!fuente) {
    throw new Error('Fuente de Informacion no encontrada');
  }

  return fuente;
}

exports.registrarFuente = async (datosFuente) => {
  const { nombre } = datosFuente;

  const fuenteExistente = await FuentesInformacion.findOne({ where: { nombre } });
  if (fuenteExistente) {
    throw new Error('La fuente de informacion ya existe');
  }

  const nuevaFuente = await FuentesInformacion.create({ nombre, activo: true });
  return nuevaFuente;
};

exports.setActivo = async (id, activo) => {
  const fuente = await FuentesInformacion.findByPk(id);
  if(!fuente) {
    throw new Error('Fuente de Informacion no encontrada');
  }

  if (fuente.activo === activo) {
    throw new Error (`La Fuente de informacion ya se encuentra ${activo ? 'activa' : 'inactiva'}`);
  }

  fuente.activo = activo;
  await fuente.save();
};

exports.editarFuente = async (id, datosActualizados) => {
  const { nombre } = datosActualizados;
  const fuente = await FuentesInformacion.findByPk(id);
  if(!fuente) {
    throw new Error('Fuente de Informacion no encontrada');
  }
  if(fuente.nombre === nombre) {
    throw new Error('No se han realizado cambios a la fuente de informacion');
  }

  const fuenteExistente = await FuentesInformacion.findOne({ where: { nombre } });

  if (fuenteExistente) {
    throw new Error('La fuente de informacion ya existe');
  }

  fuente.nombre = nombre;
  await fuente.save();
};