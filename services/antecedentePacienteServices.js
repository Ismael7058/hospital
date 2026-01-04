const { AntecedentePaciente, Paciente, TiposAtencedentes, FuentesInformacion } = require('../db/models');
const { adaptarFecha } = require('../helper/fecha')


exports.getAntecedentePaciente = async (id) => {
  const antecedente = await AntecedentePaciente.findByPk(id, {
    include: [
      {model: Paciente, attributes: ['id', 'nombre', 'apellido', 'dni'] },
      { model: TiposAtencedentes, attributes: ['id', 'nombre'] },
      { model: FuentesInformacion, attributes: ['id', 'nombre'] }
    ]
  });
  if (!antecedente) {
    throw new Error('Antecedente no encontrado');
  }

  return antecedente;
};

exports.registrarAntecedentePaciente = async (datosAntecedente) => {
  const { descripcion, observaciones, validado, fuente_informacion_id, paciente_id, tipo_antecedente_id } = datosAntecedente
  
  const nuevoAntecedente = await AntecedentePaciente.create({
    descripcion,
    fecha_registro: adaptarFecha(new Date()),
    observaciones,
    fuente_informacion_id,
    validado,
    activo: true,
    paciente_id,
    tipo_antecedente_id
  }); 

  return nuevoAntecedente;
};

exports.setActivo = async (id, activo) => {
  const antecedente = await AntecedentePaciente.findByPk(id);
  if(!antecedente) {
    throw new Error('Antecedente no encontrado');
  }

  if (antecedente.activo === activo) {
    throw new Error(`El antecedente ya se encuentra ${activo ? 'activo' : 'inactivo'}`);
  }

  antecedente.activo = activo;
  await antecedente.save();
};

exports.setValidacion = async (id, validado) => {
  const antecedente = await AntecedentePaciente.findByPk(id);
  if(!antecedente) {
    throw new Error('Antecedente no encontrado');
  }

  if (antecedente.validado === validado) {
    throw new Error(`El antecedente ya se encuentra ${validado ? 'validado' : 'no validado'}`);
  }

  antecedente.validado = validado;
  await antecedente.save();
};

exports.editarAntecedentePaciente = async (id, datosActualizados) => {
  const { descripcion, observaciones, validado } = datosActualizados;
  const antecedente = await AntecedentePaciente.findByPk(id);
  if (!antecedente) {
    throw new Error('Antecedente no encontrado');
  }

  if (antecedente.descripcion === descripcion && 
      antecedente.observaciones === observaciones && 
      antecedente.validado === validado) {
    throw new Error('El antecedente no fue modificado');
  }

  await antecedente.update({
    descripcion,
    observaciones,
    validado
  });
};