const { Admision, Turno, Paciente, Identificacion, sequelize, Usuario, Rol } = require('../db/models');
const { Op } = require('sequelize');
const { adaptarFecha } = require('../helper/fecha');

exports.registrarAdmision = async (admisionData) => {
  const { modo } = admisionData;

  switch (modo) {
    case 'guardia':
      return await registrarPorGuardia(admisionData);
    case 'emergencia':
      return await registrarPorEmergencia(admisionData);
    case 'turno':
      return await registrarPorTurno(admisionData);
    default:
      throw new Error('Modo de admisión no válido');
  }
};

const registrarPorGuardia = async (data) => {
  const { paciente_id, via_ingreso_id, motivo_internacion, usuario_agenda } = data;
  const admision = await Admision.findOne({ 
    where: { 
      paciente_id: paciente_id, 
      activo: true,
      estado: 'Activa'
    } 
  });

  if (admision) {
    throw new Error('El paciente ya se encuentra admitido');
  }
  const nuevaAdmision = await Admision.create({
    fecha_hora_ingreso: new Date(),
    motivo_internacion: motivo_internacion,
    activo: true,
    paciente_id,
    usuario_registro_id: usuario_agenda,
    via_ingreso_id,
  });
  
  return nuevaAdmision;
};

const registrarPorEmergencia = async (data) => {
  const t = await sequelize.transaction();
  try {
    let { paciente_id, via_ingreso_id, motivo_internacion, usuario_agenda, nombre, apellido, sexo, fecha_nacimiento, nro_doc, tipo_doc } = data;
    
    if (!paciente_id) {
      const timestamp = Date.now();
      const nuevoPaciente = await Paciente.create({
        nombre: nombre || 'NN',
        apellido: apellido || 'Emergencia',
        sexo,
        fecha_nacimiento: fecha_nacimiento || new Date(),
        telefono: 'N/A',
        direccion: 'N/A',
        email: `emergencia_${timestamp}@hospital.local`,
        estado_identidad: 'Temporal',
        activo: true
      }, { transaction: t });

      // Crear identificacion del paciente
      if (nro_doc && tipo_doc) {
        const idntExiste = await Identificacion.findOne({
          where: { tipo_doc, nro_doc },
          transaction: t
        });

        if (idntExiste) {
          throw new Error('La identificacion ya se encuentra registrada');
        }

        await Identificacion.create({
          tipo_doc,
          nro_doc,
          paciente_id: nuevoPaciente.id
        }, { transaction: t });
      } else {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const numero = `EMG-${year}${month}${day}-`;

        const ultAdmEmgHoy = await Identificacion.findOne({
          where: {
            nro_doc: { [Op.like]: `${numero}%` }
          },
          order: [['nro_doc', 'DESC']],
          transaction: t
        });

        const numAdmEmgHoy = ultAdmEmgHoy ? parseInt(ultAdmEmgHoy.nro_doc.split('-')[2]) + 1 : 1;
        const nro_doc_temp = `${numero}${String(numAdmEmgHoy).padStart(4, '0')}`;

        await Identificacion.create({
          tipo_doc: 'Temporal',
          nro_doc: nro_doc_temp,
          paciente_id: nuevoPaciente.id
        }, { transaction: t });
      }

      paciente_id = nuevoPaciente.id;
    }

    const nuevaAdmision = await Admision.create({
      paciente_id,
      via_ingreso_id,
      fecha_ingreso: new Date(),
      motivo: motivo_internacion || 'Ingreso por Emergencia',
      activo: true,
      usuario_id: usuario_agenda
    }, { transaction: t });

    await t.commit();
    return nuevaAdmision;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};


const registrarPorTurno = async (data) => {
  const t = await sequelize.transaction();
  try {
    const { turno_id, via_ingreso_id, motivo_internacion, usuario_agenda } = data;
    
    const turno = await Turno.findByPk(turno_id, { transaction: t });
    
    if (turno.estado == 'Cancelado') {
      throw new Error('El turno esta cancelado');
    }
    if (turno.estado !== 'Pendiente') {
      throw new Error('El turno ya fue utilizado');
    }
    if(turno.fecha != adaptarFecha(new Date())){
      throw new Error('El turno no era para la fecha de hoy');
    }

    if ((new Date).setMinutes(turno.hora_inicio + 5) < (new Date).getTime() )  {
      throw new Error('El turno esta vencido por la fecha y hora');
    }

    const medico = await Usuario.findByPk(id, {
      include: [{ model: Rol, where: { nombre: 'Medico' } }]
    });

    if (!medico) {
      throw new Error ('Medico no encontrado');
    }

    const nuevaAdmision = await Admision.create({
      paciente_id: turno.paciente_id,
      medico_id: turno.medico_id,
      via_ingreso_id,
      fecha_ingreso: new Date(),
      motivo: motivo_internacion || turno.motivo,
      activo: true,
      usuario_id: usuario_agenda
    }, { transaction: t });

    turno.estado = 'Confirmado';
    await turno.save({ transaction: t });

    await t.commit();
    return nuevaAdmision;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};