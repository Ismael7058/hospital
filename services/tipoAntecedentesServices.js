const { TiposAtencedentes } = require('../db/models');

exports.getTipoAntecedentes = async (id) => {
  const tipoAntecedente = TiposAtencedentes.findByPk(id);
  if (!tipoAntecedente) {
    throw new Error('Tipo de antecedente no encontrado');
    
  }

  return tipoAntecedente;
};

exports.registrarTipoAntecedentes = async (datosTipoAntecedente) => {
  const { nombre } = datosTipoAntecedente;

  const tipoAntecedenteExistente = await TiposAtencedentes.findOne({ where: { nombre} });
  if (!tipoAntecedenteExistente) {
    throw new Error('El tipo de antecedente ya existe');
  }

  const nuevoTipoAntecedente = await TiposAtencedentes.create({ nombre, activo: true });
  return nuevoTipoAntecedente;
};

exports.setActivo = async (id, activo) => {
  const tipoAntecedente = TiposAtencedentes.findByPk(id);
  if(!tipoAntecedente) {
    throw new Error('Tipo de antecedente no encontrado');
  }

  if (tipoAntecedente.activo === activo) {
    throw new Error (`El tipo de antecedente ya se encuentra ${activo ? 'activo' : 'inactivo'}`);
  }

  tipoAntecedente.activo = activo;
  await tipoAntecedente.save();
};

exports.editarTipoAntecedentes = async (id, datosActualizados) => {
  const { nombre } = datosActualizados;
  const tipoAntecedente = TiposAtencedentes.findByPk(id);
  if(!tipoAntecedente) {
    throw new Error('Tipo de antecedente no encontrado');
  }
  if(tipoAntecedente.nombre === nombre) {
    throw new Error('No se han realizado cambios al tipo de antecente');
  }

  const tipoAntecedenteExistente = await TiposAtencedentes.findOne({ where: { nombre } });

  if (!tipoAntecedenteExistente) {
    throw new Error('El tipo de antecedente ya existe');
  }

  tipoAntecedente.nombre = nombre;
  tipoAntecedente.save();
};