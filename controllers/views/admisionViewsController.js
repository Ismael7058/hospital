const { Admision, Paciente, ViaIngreso, Turno, Usuario, Rol, Identificacion, Ala, UbicacionInternacion, Cama, Habitacion, Especialidad, EvolucionMedica, EstudioSolicitado, SignosVitales, CuidadoPreliminar, Medicacion, ViaAdministracion, AdmisionEnfermero } = require('../../db/models');
const admisionVS = require('../../services/views/admisionViewServices')

exports.getAdmisiones = async (req, res, next) => {
  try {
    const rol = req.usuario.Rol.nombre;
    let viewData;

    switch (rol) {
      case 'Administrador':
        viewData = await admisionVS.admisionesAdministrador(req);
        break;
      case 'Recepcion':
        viewData = await admisionVS.admisionesRecepcion(req);
        break;
      case 'Enfermero':
        viewData = await admisionVS.admisionesEnfermero(req);
        break;
      case 'Medico':
        viewData = await admisionVS.admisionesMedico(req);
        break;
      default:
        throw new Error('No tiene permisos para acceder a esta sección');
    }

    res.render('./Admision/Listar.pug', viewData);
  } catch (error) {
    next(error);
  }
};



exports.getRegistrar = async (req, res, next) => {
  try {
    let viaIngresoFiltro = await ViaIngreso.findOne({ where: { nombre: 'Emergencia', activo: true } });
    res.render('./Admision/RegistrarEmergencia.pug', {
      title: 'Listado de Admisiones',
      viaIngresoFiltro
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
          attributes: ['id', 'nombre', 'apellido', 'dni'],
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
        }, 
        {
          model: AdmisionEnfermero,
          as: 'enfermeros',
          include: [
            {
              model: Usuario,
              as: 'enfermero',
              attributes: ['id', 'nombre', 'apellido', 'dni']
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
          limit: 10,
          separate: true
        },
        {
          model: EstudioSolicitado,
          as: 'estudios_solicitados',
          where: {
            activo: true
          },
          order: [['fecha_hora', 'DESC']],
          limit: 10,
          separate: true
        },
        {
          model: SignosVitales,
          as: 'signos_vitales',
          where: {
            activo: true
          },
          order: [['fecha_hora', 'DESC']],
          limit: 25,
          separate: true
        },
        {
          model: CuidadoPreliminar,
          as: 'cuidados_preliminares',
          where: {
            activo: true
          },
          order: [['fecha_hora', 'DESC']],
          limit: 10,
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
          limit: 15,
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

    const vias = await ViaAdministracion.findAll({ where: { activo: true } });
    res.render('./Admision/Estadia.pug', {
      title: 'Gestionar Estadia',
      admision,
      alas,
      vias
    });
  } catch (error) {
    console.error(error)
    next(error);
  }
};

exports.getEvolucionMedica = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pagina = parseInt(req.query.pagina, 10) || 1;
    const { activo } = req.query;
    const registrosPorPagina = 13;
    const offset = (pagina - 1) * registrosPorPagina;

    const admision = await Admision.findByPk(id, {
      include: [
        {
          model: Paciente,
          as: 'paciente',
          include: [{ model: Identificacion, as: 'identificaciones' }]
        },
      ]
    });

    if (!admision) {
      return res.redirect('/admisiones');
    }

    const whereClause = { admision_id: id };
    if (activo !== undefined && activo !== '') whereClause.activo = activo === 'true';

    const { count, rows: evoluciones } = await EvolucionMedica.findAndCountAll({
      where: whereClause,
      order: [['fecha_hora', 'DESC']],
      limit: registrosPorPagina,
      offset: offset
    });

    admision.evoluciones_medicas = evoluciones;

    const totalPaginas = Math.ceil(count / registrosPorPagina);
    const filtros = { activo };

    res.render('./Estadia/EvolucionMedica.pug', {
      title: 'Gestionar Evoluciones Medicas',
      admision,
      filtros,

      paginacion: {
        totalRegistros: count,
        totalPaginas: totalPaginas,
        paginaActual: pagina,
        registrosPorPagina: registrosPorPagina
      },
    });
  } catch (error) {
    console.error(error)
    next(error);
  }
};

exports.getEstudiosSolicitados = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pagina = parseInt(req.query.pagina, 10) || 1;
    const { activo } = req.query;
    const registrosPorPagina = 13;
    const offset = (pagina - 1) * registrosPorPagina;

    const admision = await Admision.findByPk(id, {
      include: [
        {
          model: Paciente,
          as: 'paciente',
          include: [{ model: Identificacion, as: 'identificaciones' }]
        },
      ]
    });

    if (!admision) {
      return res.redirect('/admisiones');
    }

    const whereClause = { admision_id: id };
    if (activo !== undefined && activo !== '') whereClause.activo = activo === 'true';

    const { count, rows: estudios } = await EstudioSolicitado.findAndCountAll({
      where: whereClause,
      order: [['fecha_hora', 'DESC']],
      limit: registrosPorPagina,
      offset: offset
    });

    admision.estudios_solicitados = estudios;

    const totalPaginas = Math.ceil(count / registrosPorPagina);
    const filtros = { activo };

    res.render('./Estadia/EstudioSolicitado.pug', {
      title: 'Gestionar Estudios Solicitados',
      admision,
      filtros,

      paginacion: {
        totalRegistros: count,
        totalPaginas: totalPaginas,
        paginaActual: pagina,
        registrosPorPagina: registrosPorPagina
      },
    });
  } catch (error) {
    console.error(error)
    next(error);
  }
};

exports.getCuidadosPreeliminares = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pagina = parseInt(req.query.pagina, 10) || 1;
    const { activo } = req.query;
    const registrosPorPagina = 10;
    const offset = (pagina - 1) * registrosPorPagina;

    const admision = await Admision.findByPk(id, {
      include: [
        {
          model: Paciente,
          as: 'paciente',
          include: [{ model: Identificacion, as: 'identificaciones' }]
        },
      ]
    });

    if (!admision) {
      return res.redirect('/admisiones');
    }

    const whereClause = { admision_id: id };
    if (activo !== undefined && activo !== '') whereClause.activo = activo === 'true';

    const { count, rows: cuidados } = await CuidadoPreliminar.findAndCountAll({
      where: whereClause,
      order: [['fecha_hora', 'DESC']],
      limit: registrosPorPagina,
      offset: offset
    });

    admision.cuidados_preliminares = cuidados;

    const totalPaginas = Math.ceil(count / registrosPorPagina);
    const filtros = { activo };

    res.render('./Estadia/CuidadoPreliminar.pug', {
      title: 'Gestionar Cuidados Preeliminares',
      admision,
      filtros,

      paginacion: {
        totalRegistros: count,
        totalPaginas: totalPaginas,
        paginaActual: pagina,
        registrosPorPagina: registrosPorPagina
      },
    });
  } catch (error) {
    console.error(error)
    next(error);
  }
};

exports.getMedicaciones = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pagina = parseInt(req.query.pagina, 10) || 1;
    const { activo } = req.query;
    const registrosPorPagina = 10;
    const offset = (pagina - 1) * registrosPorPagina;

    const admision = await Admision.findByPk(id, {
      include: [
        {
          model: Paciente,
          as: 'paciente',
          include: [{ model: Identificacion, as: 'identificaciones' }]
        },
      ]
    });

    if (!admision) {
      return res.redirect('/admisiones');
    }

    const whereClause = { admision_id: id };
    if (activo !== undefined && activo !== '') whereClause.activo = activo === 'true';

    const { count, rows: medicaciones } = await Medicacion.findAndCountAll({
      where: whereClause,
      order: [['fecha_hora', 'DESC']],
      limit: registrosPorPagina,
      offset: offset,
      include: [
        {
          model: ViaAdministracion,
          as: 'via_administracion',
        }
      ]
    });

    admision.medicaciones = medicaciones;

    const totalPaginas = Math.ceil(count / registrosPorPagina);
    const filtros = { activo };

    res.render('./Estadia/Medicacion.pug', {
      title: 'Gestionar Medicaciones',
      admision,
      filtros,

      paginacion: {
        totalRegistros: count,
        totalPaginas: totalPaginas,
        paginaActual: pagina,
        registrosPorPagina: registrosPorPagina
      },
    });
  } catch (error) {
    console.error(error)
    next(error);
  }
};

exports.getSignosVitales = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pagina = parseInt(req.query.pagina, 10) || 1;
    const { activo } = req.query;
    const registrosPorPagina = 10;
    const offset = (pagina - 1) * registrosPorPagina;

    const admision = await Admision.findByPk(id, {
      include: [
        {
          model: Paciente,
          as: 'paciente',
          include: [{ model: Identificacion, as: 'identificaciones' }]
        },
      ]
    });

    if (!admision) {
      return res.redirect('/admisiones');
    }

    const whereClause = { admision_id: id };
    if (activo !== undefined && activo !== '') whereClause.activo = activo === 'true';

    const { count, rows: signos } = await SignosVitales.findAndCountAll({
      where: whereClause,
      order: [['fecha_hora', 'DESC']],
      limit: registrosPorPagina,
      offset: offset
    });

    admision.signos_vitales = signos;

    const totalPaginas = Math.ceil(count / registrosPorPagina);
    const filtros = { activo };

    res.render('./Estadia/SignosVitales.pug', {
      title: 'Gestionar Signos Vitales',
      admision,
      filtros,

      paginacion: {
        totalRegistros: count,
        totalPaginas: totalPaginas,
        paginaActual: pagina,
        registrosPorPagina: registrosPorPagina
      },
    });
  } catch (error) {
    console.error(error)
    next(error);
  }
};

exports.getUbicacionesInternaciones = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pagina = parseInt(req.query.pagina, 12) || 1;
    const registrosPorPagina = 11;
    const offset = (pagina - 1) * registrosPorPagina;

    const admision = await Admision.findByPk(id, {
      include: [
        {
          model: Paciente,
          as: 'paciente',
          include: [{ model: Identificacion, as: 'identificaciones' }]
        },
      ]
    });

    if (!admision) {
      return res.redirect('/admisiones');
    }

    const whereClause = { admision_id: id };

    const { count, rows: ubicaciones } = await UbicacionInternacion.findAndCountAll({
      where: whereClause,
      order: [['fecha_hora_asignacion', 'DESC']],
      limit: registrosPorPagina,
      offset: offset,
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
        },
        {
          model: Usuario,
          as: 'usuario_asignador',
          attributes: ['nombre', 'apellido']
        }
      ]
    });

    admision.ubicaciones = ubicaciones;

    const totalPaginas = Math.ceil(count / registrosPorPagina);

    res.render('./Admision/UbicacionesInternaciones.pug', {
      title: 'Historial de Ubicaciones',
      admision,
      paginacion: {
        totalRegistros: count,
        totalPaginas: totalPaginas,
        paginaActual: pagina,
        registrosPorPagina: registrosPorPagina
      },
    });
  } catch (error) {
    console.error(error)
    next(error);
  }
};
