const { Admision, Paciente, ViaIngreso, Turno, Usuario, Rol, Identificacion, Ala, UbicacionInternacion, Cama, Habitacion, Especialidad, EvolucionMedica, EstudioSolicitado, SignosVitales, CuidadoPreliminar, Medicacion, ViaAdministracion } = require('../../db/models');
const { Op } = require('sequelize');

exports.getAdmisiones = async (req, res, next) => {
  try {
    const { fecha, estado_atencion, estado, activo, medico_id, paciente_id, via_ingreso_id, pagina = 1 } = req.query;
    const registrosPorPagina = 13;
    const offset = (pagina - 1) * registrosPorPagina;

    const whereClause = {};

    if (fecha) {
      const fechaInicio = new Date(fecha);
      const fechaFin = new Date(fecha);
      fechaFin.setDate(fechaFin.getDate() + 1);
      whereClause.fecha_hora_ingreso = {
        [Op.gte]: fechaInicio,
        [Op.lt]: fechaFin
      };
    }

    if (estado_atencion) whereClause.estado_atencion = estado_atencion;
    if (estado) whereClause.estado = estado;
    if (activo !== undefined && activo !== '') whereClause.activo = activo === 'true';

    const includeOptions = [
      { model: Usuario, as: 'medico_atencion', attributes: ['id', 'nombre', 'apellido'] },
      {
        model: Paciente,
        as: 'paciente',
        attributes: ['id', 'nombre', 'apellido'],
        include: [{ model: Identificacion, as: 'identificaciones', attributes: ['tipo_doc', 'nro_doc'] }]
      },
      { model: ViaIngreso, as: 'via_ingreso', attributes: ['id', 'nombre'] }
    ]

    if (medico_id) {
      includeOptions[0].where = { id: medico_id };
      includeOptions[0].required = true;
    }

    if (paciente_id) {
      includeOptions[1].where = { id: paciente_id };
      includeOptions[1].required = true;
    }

    if (via_ingreso_id) {
      includeOptions[2].where = {
        [Op.or]: [
          { id: via_ingreso_id }
        ]
      };
      includeOptions[2].required = true;
    }

    const { count, rows: admisiones } = await Admision.findAndCountAll({
      where: whereClause,
      include: includeOptions,
      order: [['fecha_hora_ingreso', 'DESC']],
      limit: registrosPorPagina,
      offset: offset,
      distinct: true
    });
    
    // Medico del select2
    let medicoFiltro = null;
    if (medico_id) {
      const rolMedico = await Rol.findOne({ where: { nombre: 'Medico' } });
      medicoFiltro = await Usuario.findOne({
        where: {
          id: medico_id,
          rol_id: rolMedico.id,
          activo: true 
        }
      });
    }

    // Paciente del select2
    let pacienteFiltro = null;
    if (paciente_id) {
      pacienteFiltro = await Paciente.findByPk(paciente_id, {
        attributes: ['id', 'nombre', 'apellido'],
        include: {
          model: Identificacion, as: 'identificaciones', attributes: ['tipo_doc', 'nro_doc']
        }
      });
    }

    // Via de Ingreso 
    let viaIngersoGD = await ViaIngreso.findOne({ where: { nombre: 'Guardia' } })

    let viaIngresoFiltro = await ViaIngreso.findAll();

    const totalPaginas = Math.ceil(count / registrosPorPagina);
    const filtros = { fecha, estado_atencion, estado, activo, medico_id, paciente_id, via_ingreso_id };

    Object.keys(filtros).forEach(key => {
      if (filtros[key] === undefined || filtros[key] === '') {
        delete filtros[key];
      }
    });

    const filtrosQuery = new URLSearchParams(filtros).toString();

    res.render('./Admision/Listar.pug', {
      title: 'Listado de Admisiones',
      admisiones: admisiones,
      medicoFiltro: medicoFiltro,
      pacienteFiltro: pacienteFiltro,
      viaIngresoFiltro: viaIngresoFiltro,
      viaIngresoModal: viaIngersoGD,
      paginacion: {
        totalRegistros: count,
        totalPaginas: totalPaginas,
        paginaActual: parseInt(pagina),
      },
      filtros: filtros,
      filtrosQuery: filtrosQuery
    });

  } catch (error) {
    next(error);
  }
};



exports.getRegistrar = async (req, res, next) => {
  try {
    let viaIngresoFiltro = await ViaIngreso.findOne({ where: { nombre: 'Emergencia', activo: true } });
    const alas = await Ala.findAll({ where: { activo: true } });
    res.render('./Admision/RegistrarEmergencia.pug', {
      title: 'Listado de Admisiones',
      viaIngresoFiltro,
      alas
    });
  } catch (error) {
    console.error(error)
    next(error);
  }
};

exports.getAdmision = async (req, res, next) => {
  try {
    const { id } = req.params;
    const admision = await Admision.findByPk(id, {
      include: [
        {
          model: ViaIngreso,
          as: 'via_ingreso',
          attributes: ['nombre']
        },
        {
          model: Paciente,
          as: 'paciente',
          include: [{ model: Identificacion, as: 'identificaciones' }]
        },
        {
          model: Usuario,
          as: 'medico_atencion',
          attributes: ['id', 'nombre', 'apellido'],
          include: [{
            model: Especialidad,
            attributes: ['nombre'],
            through: { attributes: [] }
          }]
        },
        {
          model: Usuario,
          as: 'usuario_registro',
          attributes: ['id', 'nombre', 'apellido']
        },
        {
          model: UbicacionInternacion,
          as: 'ubicaciones',
          order: [['fecha_hora_asignacion', 'DESC']],
          limit: 1,
          separate: true,
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
      ]
    });
    const alas = await Ala.findAll({ where: { activo: true } });

    res.render('./Admision/Gestion.pug', {
      title: 'Gestionar Admision',
      admision,
      alas
    });
  } catch (error) {
    console.error(error)
    next(error);
  }
} ;


exports.getEstadia = async (req, res, next) => {
  try {
    const { id } = req.params;
    const admision = await Admision.findByPk(id, {
      include: [
        {
          model: ViaIngreso,
          as: 'via_ingreso',
          attributes: ['nombre']
        },
        {
          model: EvolucionMedica,
          as: 'evoluciones_medicas',
          where: {
            activo: true
          },
          order: [['fecha_hora', 'DESC']],
          limit: 4,
          separate: true
        },
        {
          model: EstudioSolicitado,
          as: 'estudios_solicitados',
          where: {
            activo: true
          },
          order: [['fecha_hora', 'DESC']],
          limit: 4,
          separate: true
        },
        {
          model: SignosVitales,
          as: 'signos_vitales',
          where: {
            activo: true
          },
          order: [['fecha_hora', 'DESC']],
          limit: 1,
          separate: true
        },
        {
          model: CuidadoPreliminar,
          as: 'cuidados_preliminares',
          where: {
            activo: true
          },
          order: [['fecha_hora', 'DESC']],
          limit: 4,
          separate: true
        },
        {
          model: Medicacion,
          as: 'medicaciones',
          where: {
            activo: true,
            estado: 'Suministrar'
          },
          order: [['fecha_hora', 'DESC']],
          limit: 3,
          separate: true,
          include: [{
            model: ViaAdministracion,
            as: 'via_administracion'
          }]
        },
        {
          model: Paciente,
          as: 'paciente',
          include: [{ model: Identificacion, as: 'identificaciones' }]
        },
        {
          model: Usuario,
          as: 'medico_atencion',
          attributes: ['id', 'nombre', 'apellido'],
          include: [{
            model: Especialidad,
            attributes: ['nombre'],
            through: { attributes: [] }
          }]
        },
        {
          model: Usuario,
          as: 'usuario_registro',
          attributes: ['id', 'nombre', 'apellido']
        },
        {
          model: UbicacionInternacion,
          as: 'ubicaciones',
          order: [['fecha_hora_asignacion', 'DESC']],
          limit: 4,
          separate: true,
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
      ]
    });
    const alas = await Ala.findAll({ where: { activo: true } });

    res.render('./Admision/Estadia.pug', {
      title: 'Gestionar Estadia',
      admision,
      alas
    });
  } catch (error) {
    console.error(error)
    next(error);
  }
};