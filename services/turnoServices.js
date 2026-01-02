const { Turno, Usuario, Paciente, Rol, Horario, Agenda } = require('../db/models');
const { Op } = require('sequelize');
const { adaptarFecha } = require('../helper/fecha');


exports.registrarTurno = async (turnoData) => {
  const { medico_id, paciente_id, usuario_agenda, fecha, hora_inicio, hora_fin, motivo } = turnoData;
  
  const fechaAdptada = adaptarFecha(fecha);

  const medico = await verificarMedico(medico_id);
  if (!medico) {
    throw new Error('Medico no encontrado');
  }
  
  const paciente = await Paciente.findByPk(paciente_id);
  if (!paciente) {
    throw new Error('Paciente no encontrado');
  }
  
  const medicoDisponible = await verificarDisponibilidadMedico(medico_id, fechaAdptada, hora_inicio, hora_fin);
  if (!medicoDisponible) {
    throw new Error('El medico no atiende en ese horario');
  }
  if (medicoDisponible.agendas && medicoDisponible.agendas.length > 0) {
    throw new Error('El medico no se encuentra disponible en esa fecha');
  }
  
  const turnoExistente = await verificarTurnoExistente(medico_id, fechaAdptada, hora_inicio, hora_fin);
  if (turnoExistente) {
    throw new Error('El turno se superpone con otro turno vigente');
  }

  const turnoPaciente = await verificarSuperposicionPaciente(paciente_id, fechaAdptada, hora_inicio, hora_fin);
  if (turnoPaciente) {
    throw new Error('El paciente ya tiene un turno en ese horario');
  }

  const nuevoTurno = await Turno.create({
    fecha: fechaAdptada,
    hora_inicio,
    hora_fin,
    motivo,
    estado: 'Pendiente',
    activo: true,
    medico_id,
    usuario_agenda,
    paciente_id
  });

  return nuevoTurno;
};

exports.editarTurno = async (id, datosModificados) => {
  const { medico_id, paciente_id, fecha, hora_inicio, hora_fin, motivo, estado } = datosModificados;
  const turno = await Turno.findByPk(id);
  
  const fechaAdptada = adaptarFecha(fecha);

  if (!turno){
    throw new Error('Turno no encontrado');
  }

  /*
    Pediente - Validar que no tenga una Admision cuando el estado es igual a Cancelado 
  */ 

  const medico = await verificarMedico(medico_id);
  if (!medico) {
    throw new Error('Medico no encontrado');
  }

  const paciente = await Paciente.findByPk(paciente_id);
  if (!paciente) {
    throw new Error('Paciente no encontrado');
  }

  const medicoDisponible = await verificarDisponibilidadMedico(medico_id, fechaAdptada, hora_inicio, hora_fin);
  if (!medicoDisponible) {
    throw new Error('El medico no atiende en ese horario');
  }
  if (medicoDisponible.agendas && medicoDisponible.agendas.length > 0) {
    throw new Error('El medico no se encuentra disponible en esa fecha');
  }

  const turnoExistente = await verificarTurnoExistente(medico_id, fechaAdptada, hora_inicio, hora_fin, id);
  if (turnoExistente) {
    throw new Error('El turno se superpone con otro turno vigente');
  }

  const turnoPaciente = await verificarSuperposicionPaciente(paciente_id, fechaAdptada, hora_inicio, hora_fin, id);
  if (turnoPaciente) {
    throw new Error('El paciente ya tiene un turno en ese horario');
  }

  await turno.update({ 
    medico_id,
    paciente_id,
    fecha: fechaAdptada,
    hora_inicio,
    hora_fin,
    motivo,
    estado
  });
};

exports.setActivo = async (id, activo) => {
  const turno = await Turno.findByPk(id);
  if (!turno){
    throw new Error('Turno no encontrado');
  }

  if (turno.activo === activo) {
      throw new Error(`El turno ya se encuentra ${activo ? 'activo' : 'inactivo'}.`);
  }

  const medico = await verificarMedico(turno.medico_id);
  if (!medico) {
    throw new Error('Medico no encontrado');
  }

  const paciente = await Paciente.findByPk(turno.paciente_id);
  if (!paciente) {
    throw new Error('Paciente no encontrado');
  }

  if (activo){
    const fechaAdptada = adaptarFecha(turno.fecha);

    const medicoDisponible = await verificarDisponibilidadMedico(turno.medico_id, fechaAdptada, turno.hora_inicio, turno.hora_fin);
    if (!medicoDisponible) {
      throw new Error('El medico no atiende en ese horario');
    }
    if (medicoDisponible.agendas && medicoDisponible.agendas.length > 0) {
      throw new Error('El medico no se encuentra disponible en esa fecha');
    }

    const turnoExistente = await verificarTurnoExistente(turno.medico_id, fechaAdptada, turno.hora_inicio, turno.hora_fin);
    if (turnoExistente) {
      throw new Error('El turno se superpone con otro turno vigente');
    }

    const turnoPaciente = await verificarSuperposicionPaciente(turno.paciente_id, fechaAdptada, turno.hora_inicio, turno.hora_fin, id);
    if (turnoPaciente) {
      throw new Error('El paciente ya tiene un turno en ese horario');
    }
  }

  /*
    Pediente - Validar que no tenga una Admision cuando el activo del turno es false 
  */

  turno.activo= activo;
  await turno.save();
};

exports.setEstado = async (id, estado) => {
  const turno = await Turno.findByPk(id);
  if (!turno){
    throw new Error('Turno no encontrado');
  }

  if (turno.estado === estado) {
      throw new Error(`El estado del turno ya era: ${estado}`);
  }

  /*
    Pediente - Validar que no tenga una Admision cuando el estado es igual a Cancelado 
  */ 

  turno.estado = estado;
  await turno.save();
};

exports.getTurno = async (id) => {
  const turno = await Turno.findByPk(id);
  if (!turno){
    throw new Error('Turno no encontrado');
  }

  return turno;
}

exports.eliminarTurno = async (id) => {
  const turno = await Turno.findByPk(id);
  if (!turno){
    throw new Error('Turno no encontrado');
  }
  /*
    Pediente - Validar que no tenga una Admision cuando se quiera eliminar un Turno 
  */ 
  await turno.destroy();
}

const verificarSuperposicionPaciente = async (paciente_id, fecha, hora_inicio, hora_fin, idExcluido = null) => {
  const where = {
    paciente_id,
    fecha,
    activo: true,
    estado: { [Op.ne]: 'Cancelado' },
    [Op.and]: [
      { hora_inicio: { [Op.lt]: hora_fin } },
      { hora_fin: { [Op.gt]: hora_inicio } }
    ]
  };

  if (idExcluido) {
    where.id = { [Op.ne]: idExcluido };
  }

  const turno = await Turno.findOne({
    where: where
  });

  return turno;
};

const verificarMedico = async (id) => {
  const medico = await Usuario.findOne({
    where: {
      id: id,
      activo: true
    },
    include: [{
      model: Rol,
      where: { nombre: 'Medico' }
    }]
  });

  return medico
};

const DIAS_SEMANA = {
  0: 'Domingo',
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
};

const verificarDisponibilidadMedico = async (id, fechaTurno, hora_inicio, hora_fin) => {
  const fechaObj = new Date(fechaTurno);
  const diaSemana = DIAS_SEMANA[fechaObj.getUTCDay()];
  const medicoDisponible = await Usuario.findOne({
    where: {
      id: id,
      activo: true
    },
    include: [
      {
        model: Horario,
        as: 'horarios',
        required: true,
        where: {
          activo: true,
          fecha: diaSemana,
          hora_inicio: { [Op.lte]: hora_inicio },
          hora_fin: { [Op.gte]: hora_fin }
        }
      },
      {
        model: Agenda,
        as: 'agendas',
        required: false,
        where: {
          activo: true,
          fecha_inicio: { [Op.lte]: fechaObj },
          fecha_fin: { [Op.gte]: fechaObj }
        }
      }
    ]
  });

  return medicoDisponible;
};

const verificarTurnoExistente = async (medico_id, fecha, hora_inicio, hora_fin, idExcluido = null) => {
  const where = {
    medico_id,
    fecha,
    activo: true,
    estado: { [Op.ne]: 'Cancelado' },
    [Op.and]: [ 
      { hora_inicio: { [Op.lt]: hora_fin } },
      { hora_fin: { [Op.gt]: hora_inicio } }
    ]
  };

  if (idExcluido) {
    where.id = { [Op.ne]: idExcluido };
  }

  const turnoExistente = await Turno.findOne({
    where: where
  });

  return turnoExistente
}