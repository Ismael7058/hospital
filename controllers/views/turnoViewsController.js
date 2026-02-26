const { Turno, Usuario, Paciente, Rol, Identificacion, ViaIngreso } = require('../../db/models');
const { Op } = require('sequelize');

exports.getTurnos = async (req, res, next) => {
  try {
    const { fecha, estado, medico_id, paciente_id, activo, pagina = 1 } = req.query;
    const registrosPorPagina = 13;
    const offset = (pagina - 1) * registrosPorPagina;

    const whereClause = {};

    if (fecha) whereClause.fecha = fecha;
    if (estado) whereClause.estado = estado;
    if (medico_id) whereClause.medico_id = medico_id;
    if (activo !== undefined && activo !== '') whereClause.activo = activo === 'true';

    const includeOptions = [
      { model: Usuario, as: 'medico', attributes: ['id', 'nombre', 'apellido'] },
      {
        model: Paciente,
        as: 'paciente',
        attributes: ['id', 'nombre', 'apellido'],
        include: [{ model: Identificacion, as: 'identificaciones', attributes: ['tipo_doc', 'nro_doc'] }]
      }
    ]

    if (medico_id) {
      includeOptions[0].where = { id: medico_id };
      includeOptions[0].required = true;
    }

    if (paciente_id) {
      includeOptions[1].where = { id: paciente_id };
      includeOptions[1].required = true;
    }

    const { count, rows: turnos } = await Turno.findAndCountAll({
        where: whereClause,
        include: includeOptions,
        order: [['hora_inicio', 'DESC']],
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

    const totalPaginas = Math.ceil(count / registrosPorPagina);
    const filtros = { fecha, estado, medico_id, paciente_id, activo };
    Object.keys(filtros).forEach(key => {
        if (filtros[key] === undefined || filtros[key] === '') {
            delete filtros[key];
        }
    });

    const filtrosQuery = new URLSearchParams(filtros).toString();

    res.render('./Turno/Listar.pug', {
        title: 'Listado de Turnos',
        turnos: turnos,
        medicoFiltro: medicoFiltro,
        pacienteFiltro: pacienteFiltro,
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
}

exports.getRegistrar = async (req, res, next) => {
    try {
        const { usuario_id, paciente_id } = req.query;
        let medicoPreseleccionado = null;
        let pacientePreseleccionado = null;

        if (usuario_id) {
            medicoPreseleccionado = await Usuario.findByPk(usuario_id, {
                attributes: ['id', 'nombre', 'apellido', 'dni']
            });
        }

        if (paciente_id) {
            pacientePreseleccionado = await Paciente.findByPk(paciente_id, {
                attributes: ['id', 'nombre', 'apellido'],
                include: [{ model: Identificacion, as: 'identificaciones', attributes: ['nro_doc'] }]
            });
        }

        res.render('./Turno/Registrar.pug', {
            title: 'Registrar Nuevo Turno',
            medicoPreseleccionado,
            pacientePreseleccionado
        });
    } catch (error) {
        next(error);
    }
}


exports.getTurno = async (req, res, next) => {
    try {
        const { id } = req.params;
        const turno = await Turno.findByPk(id, {
            include: [
                { model: Usuario, as: 'medico', attributes: ['id', 'nombre', 'apellido', 'dni'] },
                { model: Paciente, as: 'paciente', attributes: ['id', 'nombre', 'apellido'], include: [{ model: Identificacion, as: 'identificaciones' }] }
            ]
        });

        if (!turno) {
            throw new Error('Turno no encontrado');
        }

        const viaIngreso = await ViaIngreso.findOne({ where: { nombre: 'Turno'}, attributes: ['id'] })

        res.render('./Turno/Gestion.pug', {
            title: 'Gestionar Turno',
            turno,
            viaIngreso
        });
    } catch (error) {
        next(error);
    }
}