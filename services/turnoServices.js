const { Turno, Usuario, Paciente, Horario, Agenda, Admision } = require('../db/models');
const { Op } = require('sequelize');
const { adaptarFecha, restarMinutos } = require('../helper/fecha');


exports.registrarTurno = async (turnoData) => {
  const { medico_id, paciente_id, usuario_agenda, fecha, hora_inicio, hora_fin, motivo } = turnoData;
  
  const horaFinAjustada = restarMinutos(hora_fin, 1);

  const fechaAdptada = adaptarFecha(fecha);

  const paciente = await Paciente.findByPk(paciente_id);
  if (!paciente) {
    throw new Error('Paciente no encontrado');
  }
  
  const medicoDisponible = await verificarDisponibilidadMedico(medico_id, fechaAdptada, hora_inicio, horaFinAjustada);
  if (!medicoDisponible) {
    throw new Error('El medico no atiende en ese horario');
  }
  if (medicoDisponible.agendas && medicoDisponible.agendas.length > 0) {
    throw new Error('El medico no se encuentra disponible en esa fecha');
  }
  
  const turnoExistente = await verificarTurnoExistente(medico_id, fechaAdptada, hora_inicio, horaFinAjustada);
  if (turnoExistente) {
    throw new Error('El turno se superpone con otro turno vigente');
  }

  const turnoPaciente = await verificarSuperposicionPaciente(paciente_id, fechaAdptada, hora_inicio, horaFinAjustada);
  if (turnoPaciente) {
    throw new Error('El paciente ya tiene un turno en ese horario');
  }

  const nuevoTurno = await Turno.create({
    fecha: fechaAdptada,
    hora_inicio,
    hora_fin: horaFinAjustada,
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
  const turno = await Turno.findByPk(id, { include: [{ model: Admision }] });
  
  const fechaAdptada = adaptarFecha(fecha);

  if (!turno){
    throw new Error('Turno no encontrado');
  }

  if (turno.Admision && turno.Admision.activo && ['En Atencion', 'Finalizado'].includes(turno.Admision.estado_atencion) && ['Alta Medica', 'Activa'].includes(turno.Admision.estado)) {
    throw new Error('No se puede modificar el turno porque ya posee una admisión asociada');
  }

  const horaFinAjustada = restarMinutos(hora_fin, 1);

  const paciente = await Paciente.findByPk(paciente_id);
  if (!paciente) {
    throw new Error('Paciente no encontrado');
  }

  const medicoDisponible = await verificarDisponibilidadMedico(medico_id, fechaAdptada, hora_inicio, horaFinAjustada);
  if (!medicoDisponible) {
    throw new Error('El medico no atiende en ese horario');
  }
  if (medicoDisponible.agendas && medicoDisponible.agendas.length > 0) {
    throw new Error('El medico no se encuentra disponible en esa fecha');
  }

  const turnoExistente = await verificarTurnoExistente(medico_id, fechaAdptada, hora_inicio, horaFinAjustada, id);
  if (turnoExistente) {
    throw new Error('El turno se superpone con otro turno vigente');
  }

  const turnoPaciente = await verificarSuperposicionPaciente(paciente_id, fechaAdptada, hora_inicio, horaFinAjustada, id);
  if (turnoPaciente) {
    throw new Error('El paciente ya tiene un turno en ese horario');
  }

  await turno.update({ 
    medico_id,
    paciente_id,
    fecha: fechaAdptada,
    hora_inicio,
    hora_fin: horaFinAjustada,
    motivo,
    estado
  });
};

exports.setActivo = async (id, activo) => {
  const turno = await Turno.findByPk(id, { include: [{ model: Admision }] });
  if (!turno){
    throw new Error('Turno no encontrado');
  }

  if (turno.activo === activo) {
      throw new Error(`El turno ya se encuentra ${activo ? 'activo' : 'inactivo'}.`);
  }

  if (activo){
    const paciente = await Paciente.findByPk(turno.paciente_id);
    if (!paciente) {
      throw new Error('Paciente no encontrado');
    }

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

  if (!activo && turno.Admision) {
    throw new Error('No se puede desactivar el turno porque ya posee una admisión asociada');
  }

  turno.activo= activo;
  await turno.save();
};

exports.setEstado = async (id, estado, rol) => {
  const turno = await Turno.findByPk(id, {include: [{model: Admision}]});
  if (!turno){
    throw new Error('Turno no encontrado');
  }

  if (turno.Admision && turno.Admision.activo || turno.Admision.estado_atencion != 'En Espera') {
      throw new Error('No se puede cambiar el estado del turno porque ya posee una admisión gestionada');
  }

  if (estado != 'Cancelado') {
    if (rol == 'Recepcion'){
      throw new Error('No tienes permisos para realizar esta acción');
    }
  }
  
  if (turno.estado === estado) {
      throw new Error(`El estado del turno ya era: ${estado}`);
  }

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
  const turno = await Turno.findByPk(id, { include: [{ model: Admision }] });
  if (!turno){
    throw new Error('Turno no encontrado');
  }
  if (turno.Admision) {
    throw new Error('No se puede eliminar el turno porque ya posee una admisión asociada');
  }
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