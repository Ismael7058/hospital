const { Admision, Turno, Paciente, Identificacion, sequelize, Usuario, Rol, UbicacionInternacion, Cama, Habitacion, Ala } = require('../db/models');
const { Op } = require('sequelize');

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
    let { medico_atencion_id, paciente_id, via_ingreso_id, motivo_internacion, usuario_agenda, nombre, apellido, sexo, fecha_nacimiento, nro_doc, tipo_doc, cama_id } = data;
    
    let sexoPaciente = sexo;
    if (paciente_id) {
      const pacienteExistente = await Paciente.findByPk(paciente_id, { transaction: t });
      if (!pacienteExistente) throw new Error('Paciente no encontrado');
      sexoPaciente = pacienteExistente.sexo;
      
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
    }

    if (cama_id) {
      const cama = await Cama.findByPk(cama_id, { transaction: t });
      if (!cama) throw new Error('Cama no encontrada');
      if (cama.estado !== 'Libre') throw new Error('La cama seleccionada no está libre');

      const habitacion = await Habitacion.findOne({
        where: {
          id: cama.habitacion_id 
        },
        transaction: t,
        include: [
          {
            model:Cama,
            as: 'camas',
            where: { activo: true },
            include: [
              {
                model: UbicacionInternacion,
                as: 'ubicaciones',
                order: [['fecha_hora_asignacion', 'DESC']],
                limit: 1,
                include: [
                  {
                    model:Admision,
                    as: 'admision',
                    include: [
                      {
                        model: Paciente,
                        as: 'paciente',
                        attributes: ['id', 'sexo'] 
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      });

      if (habitacion && habitacion.camas && habitacion.camas.length > 1) {
        const otrasCamasOcupadas = habitacion.camas.filter(c => c.id !== parseInt(cama_id) && c.estado === 'Ocupado');

        for (const otraCama of otrasCamasOcupadas) {
          const ubicacionVecina = otraCama.ubicaciones[0];
          if (ubicacionVecina && ubicacionVecina.admision && ubicacionVecina.admision.paciente) {
            if (ubicacionVecina.admision.paciente.sexo !== sexoPaciente) {
              throw new Error('La cama no puede ser asignada por diferencias de genero con otra cama de la habitacion');
            }
          }
        }
      }
    }

    if (!paciente_id) {
      const timestamp = Date.now();
      const nuevoPaciente = await Paciente.create({
        nombre: nombre || 'NN',
        apellido: apellido || 'Emergencia',
        sexo: sexoPaciente,
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
      fecha_hora_ingreso: new Date(),
      motivo_internacion: motivo_internacion || 'Ingreso por Emergencia',
      estado_atencion: cama_id ? "En Atencion" : 'En Espera',
      estado: "Activa",
      activo: true,
      usuario_registro_id: usuario_agenda,
      medico_atencion_id: medico_atencion_id || null
    }, { transaction: t });

    if (cama_id) {
      await UbicacionInternacion.create({
        fecha_hora_asignacion: new Date(),
        cama_id,
        admision_id: nuevaAdmision.id,
        usuario_asignacion: usuario_agenda
      }, { transaction: t });

      await Cama.update({ estado: 'Ocupado' }, { where: { id: cama_id }, transaction: t });
    }

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

    let fechaTurno = new Date(turno.fecha);
    if (typeof turno.fecha === 'string' && !turno.fecha.includes('T')) {
      fechaTurno = new Date(turno.fecha + 'T00:00:00');
    }
    if(fechaTurno.toDateString() != new Date().toDateString()){
      throw new Error('El turno no era para la fecha de hoy');
    }

    if ((new Date).setMinutes(turno.hora_inicio + 10) < (new Date).getTime() ) {
      throw new Error('El turno esta vencido por la fecha y hora');
    }

    const medico = await Usuario.findByPk(turno.medico_id, {
      include: [{ model: Rol, where: { nombre: 'Medico' } }]
    });

    if (!medico) {
      throw new Error ('Medico no encontrado');
    }

    const nuevaAdmision = await Admision.create({
      paciente_id: turno.paciente_id,
      medico_atencion_id: turno.medico_id,
      via_ingreso_id,
      fecha_hora_ingreso: new Date(),
      motivo_internacion: motivo_internacion || 'Ingreso por Turno',
      estado: "Activa",
      activo: true,
      usuario_registro_id: usuario_agenda,
    }, { transaction: t });

    turno.estado = 'Confirmado';
    turno.admision_id = nuevaAdmision.id;
    await turno.save({ transaction: t });

    await t.commit();
    return nuevaAdmision;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

exports.setActivo = async (id, activo) => {
  const admision = await Admision.findByPk(id);
  if (!admision) {
    throw new Error('Admision no encontrada');
  }

  if (admision.activo === activo) {
    throw new Error(`La admision ya se encuentra ${activo ? 'activa' : 'inactiva'}.`);
  }

  if (admision.estado_atencion != 'En Espera') {
    throw new Error('La admision no puede cambiar su estado activo');
  }

  admision.activo = activo;

  await admision.save();
}

exports.setEstado = async (id, estado, rol) => {
  const t = await sequelize.transaction();
  try {
    const admision = await Admision.findByPk(
      id, 
      { 
        include: [
        {
          model: UbicacionInternacion,
          as: 'ubicaciones',
          order: [['fecha_hora_asignacion', 'DESC']],
          limit: 1,
          include: [
            {
              model: Cama,
              as: 'cama',
              include: [
                {
                  model: Habitacion,
                  as: 'habitacion',
                  include: [
                    {
                      model: Ala,
                      as: 'ala'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      transaction: t 
    });

    if (!admision) {
      throw new Error('Admision no encontrada');
    }

    if (!admision.activo) {
      throw new Error('La admision no puede cambiar su estado');
    }

    if (admision.estado === estado) {
      throw new Error(`La admision ya se encuentra con el estado ${estado}`);
    }

    if (estado === 'Alta Medica') {
      if (rol !== 'Medico') {
        throw new Error('No tienes permisos para realizar esta acción');
      }
      if (admision.estado_atencion != 'En Atencion') {
        throw new Error('La admision no puede recibir un alta medica');
      }

      if (admision.ubicaciones && admision.ubicaciones.length > 0) {
        const ubicacionActual = admision.ubicaciones[0];

        ubicacionActual.fecha_hora_liberacion = new Date();
        await ubicacionActual.save({ transaction: t });

        if (ubicacionActual.cama) {
          ubicacionActual.cama.estado = 'Higienizando';
          await ubicacionActual.cama.save({ transaction: t });
        }
      }
    }

    if (estado != 'Cancelada' && rol == 'Recepcion') {
      throw new Error('No tienes permisos para realizar esta acción');
    }

    if (estado === 'Cancelada') {
      if (admision.estado_atencion != 'En Espera') {
        throw new Error('La admision no puede ser cancelada');
      }
    }

    admision.estado = estado;
    admision.estado_atencion = "Finalizado"
    await admision.save({ transaction: t });

    await t.commit();
  } catch (error) {
    await t.rollback();
    throw error;
  }
}

exports.cambiarCama = async (id, cama_id, usuario_asignacion = null) => {
  const t = await sequelize.transaction();
  try {
    const admision = await Admision.findByPk(
      id, 
      { 
        include: [
        {
          model: UbicacionInternacion,
          as: 'ubicaciones',
          order: [['fecha_hora_asignacion', 'DESC']],
          limit: 1,
          include: [
            {
              model: Cama,
              as: 'cama',
              include: [
                {
                  model: Habitacion,
                  as: 'habitacion',
                  include: [
                    {
                      model: Ala,
                      as: 'ala'
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          model: Paciente,
          as: 'paciente',
          attributes: ['id', 'sexo']          
        }
      ],
      transaction: t 
    });

    if (!admision) {
      throw new Error('Admision no encontrada');
    }
    
    if (!admision.activo || admision.estado_atencion != 'En Atencion' || admision.estado != 'Activa') {
      throw new Error('No se puede asignar la cama a esta admision');
    }


    if (admision.ubicaciones && admision.ubicaciones.length > 0) {
      const ubicacionActual = admision.ubicaciones[0];
      if (ubicacionActual.cama.id == cama_id) {
        throw new Error('El paciente ocupa esta cama actualmente');
      }

      ubicacionActual.fecha_hora_liberacion = new Date();
      await ubicacionActual.save({ transaction: t });

      await Cama.update({ estado: 'Higienizando' }, { where: { id: ubicacionActual.cama.id }, transaction: t });
    }

    const cama = await Cama.findByPk(cama_id);
    if (!cama) throw new Error('Cama no encontrada');
    
    if (cama.estado !== 'Libre') {
        throw new Error('La cama seleccionada no está libre');
    }

    const habitacion = await Habitacion.findOne({
      where: {
        id: cama.habitacion_id 
      },
      transaction: t,
      include: [
        {
          model:Cama,
          as: 'camas',
          where: { activo: true },
          include: [
            {
              model: UbicacionInternacion,
              as: 'ubicaciones',
              order: [['fecha_hora_asignacion', 'DESC']],
              limit: 1,
              include: [
                {
                  model:Admision,
                  as: 'admision',
                  include: [
                    {
                      model: Paciente,
                      as: 'paciente',
                      attributes: ['id', 'sexo'] 
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    if (habitacion.camas && habitacion.camas.length > 1) {
      const otrasCamasOcupadas = habitacion.camas.filter(c => c.id !== parseInt(cama_id) && c.estado === 'Ocupado');

      for (const otraCama of otrasCamasOcupadas) {
        const ubicacionVecina = otraCama.ubicaciones[0];
        if (ubicacionVecina && ubicacionVecina.admision && ubicacionVecina.admision.paciente) {
          if (ubicacionVecina.admision.paciente.sexo !== admision.paciente.sexo) {
            throw new Error('La cama no puede ser asignada por diferencias de genero con otra cama de la habitacion');
          }
        }
      }
    }

    await UbicacionInternacion.create({
      fecha_hora_asignacion: new Date(),
      fecha_hora_liberacion: null,
      usuario_asignacion: usuario_asignacion,
      cama_id: cama_id,
      admision_id: id
    }, { transaction: t} );

    cama.estado = 'Ocupado';
    
    await cama.save({ transaction: t });
    await t.commit();
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

exports.atenderAdmision = async (id, admisionData) => {
    const {rol_usuario, cama_id, medico_id} = admisionData;

    switch (rol_usuario) {
      case 'Medico':
        return await atenderMedico(id, cama_id, medico_id);
      default:
        throw new Error('Acceso denegado');
    }
}

const atenderMedico = async (id, cama_id, medico_id) => {
  const t = await sequelize.transaction();
  try {
    const admision = await Admision.findByPk(
      id, 
      { 
        include: [
        {
          model: Paciente,
          as: 'paciente',
          attributes: ['id', 'sexo']          
        }
      ],
      transaction: t 
    });

    if (!admision) {
      throw new Error('Admision no encontrada');
    }
    
    if (!admision.activo || admision.estado_atencion != 'En Espera' || admision.estado != 'Activa') {
      throw new Error('No se puede atender esta admision');
    }


    const cama = await Cama.findByPk(cama_id);
    if (!cama) throw new Error('Cama no encontrada');
    
    if (cama.estado !== 'Libre') {
        throw new Error('La cama seleccionada no está libre');
    }

    const habitacion = await Habitacion.findOne({
      where: {
        id: cama.habitacion_id 
      },
      transaction: t,
      include: [
        {
          model:Cama,
          as: 'camas',
          where: { activo: true },
          include: [
            {
              model: UbicacionInternacion,
              as: 'ubicaciones',
              order: [['fecha_hora_asignacion', 'DESC']],
              limit: 1,
              include: [
                {
                  model:Admision,
                  as: 'admision',
                  include: [
                    {
                      model: Paciente,
                      as: 'paciente',
                      attributes: ['id', 'sexo'] 
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    if (habitacion.camas && habitacion.camas.length > 1) {
      const otrasCamasOcupadas = habitacion.camas.filter(c => c.id !== parseInt(cama_id) && c.estado === 'Ocupado');

      for (const otraCama of otrasCamasOcupadas) {
        const ubicacionVecina = otraCama.ubicaciones[0];
        if (ubicacionVecina && ubicacionVecina.admision && ubicacionVecina.admision.paciente) {
          if (ubicacionVecina.admision.paciente.sexo !== admision.paciente.sexo) {
            throw new Error('La cama no puede ser asignada por diferencias de genero con otra cama de la habitacion');
          }
        }
      }
    }

    admision.medico_atencion_id = medico_id;
    admision.estado_atencion = 'En Atencion';
    await admision.save({ transaction: t });

    await UbicacionInternacion.create({
      fecha_hora_asignacion: new Date(),
      fecha_hora_liberacion: null,
      usuario_asignacion: medico_id,
      cama_id: cama_id,
      admision_id: id
    }, { transaction: t} );

    cama.estado = 'Ocupado';
    await cama.save({ transaction: t });
    await t.commit();
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

exports.cambiarPaciente = async (id, paciente_id) => {
  const t = await sequelize.transaction();
  try {
    const admision = await Admision.findByPk(
      id, 
      { 
        include: [
        {
          model: Paciente,
          as: 'paciente',
          attributes: ['id', 'sexo', 'estado_identidad']          
        }
      ],
      transaction: t 
    });
    if (!admision) {
      throw new Error('Admision no encontrada');
    }

    const paciente = await Paciente.findByPk(paciente_id, { 
      include: [
        {
          model: Admision,
          as: 'admisiones',
          where: {
            activo: true,
            estado_atencion: 'En Atencion',
            estado: 'Activa'
          },
          limit: 1
        }
      ],
      transaction: t 
    });
    if (!paciente) {
      throw new Error('Paciente no encontrado');
    }
    if (admision.paciente.id == paciente.id){
      throw new Error('El paciente seleccionado es el mismo de la admision');
    }
    if (admision.paciente.sexo != paciente.sexo){
      throw new Error('El genero del paciente registrado no es el mismo del paciente admitido');
    }
    if (admision.paciente.estado_identidad == 'Validado' || !admision.activo){
      throw new Error('No se puede cambiar el paciente a esta admision');
    }
    if(paciente.admisiones.length > 0){
      throw new Error('El paciente esta admitido en el hospital');
    }

    const pacienteAnterior = admision.paciente;
    admision.paciente_id = paciente_id;

    await admision.save({ transaction: t });
    await pacienteAnterior.destroy({ transaction: t });
    await t.commit();
  } catch (error) {
    await t.rollback();
    throw error;
  }
};