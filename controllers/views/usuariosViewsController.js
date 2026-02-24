const { Rol, Usuario, Agenda, Horario } = require('../../db/models');
const { Op } = require('sequelize');

exports.getRegistrar = async (req, res, next) => {
    try {
        const roles = await Rol.findAll({
            attributes: ['id', 'nombre'],
            order: [['nombre', 'ASC']]
        });

        res.render('./Usuario/Registrar.pug', {
            title: 'Registrar Usuario',
            roles: roles,
            old: {},
            errors: []
        });
    } catch (error) {
        next(error);
    }
};

exports.getUsuario = async (req, res, next) => {
    try {
        const usuarioId = req.params.id;
        const [usuario, roles] = await Promise.all([
            Usuario.findByPk(usuarioId),
            Rol.findAll({ attributes: ['id', 'nombre'], order: [['nombre', 'ASC']] })
        ]);

        if (!usuario) {
            req.flash('error', `El usuario con ID ${usuarioId} no fue encontrado.`);
            return res.redirect('/usuarios');
        }

        res.render('./Usuario/Gestion.pug', {
            title: `Gestión de ${usuario.nombre} ${usuario.apellido}`,
            usuario: usuario,
            roles: roles
        });
    } catch (error) {
        next(error);
    }
}

exports.getListar = async (req, res, next) => {
    try {
        // 1. OBTENER PARÁMETROS DE FILTRO Y PAGINACIÓN DE LA URL (req.query)
        const { dni, nombre, email, rol_id, activo, pagina = 1 } = req.query;
        const registrosPorPagina = 13;
        const offset = (pagina - 1) * registrosPorPagina;

        // 2. CONSTRUIR LA CLÁUSULA 'WHERE' DINÁMICAMENTE
        const whereClause = {};
        if (dni) whereClause.dni = { [Op.like]: `%${dni}%` }; // `if ('')` es falsy, esto está bien.
        if (nombre) { // `if ('')` es falsy, esto está bien.
            whereClause[Op.or] = [
                { nombre: { [Op.like]: `%${nombre}%` } },
                { apellido: { [Op.like]: `%${nombre}%` } }
            ];
        }
        if (email) whereClause.email = { [Op.like]: `%${email}%` }; // `if ('')` es falsy, esto está bien.
        if (rol_id) whereClause.rol_id = rol_id; // `if ('')` es falsy, esto está bien.
        if (activo !== undefined && activo !== '') whereClause.activo = activo === 'true';

        // 3. REALIZAR LA CONSULTA CON FILTROS Y PAGINACIÓN
        // Usamos findAndCountAll para obtener los registros y el conteo total en una sola llamada
        const { count, rows: usuarios } = await Usuario.findAndCountAll({
            where: whereClause,
            include: [{
                model: Rol,
                attributes: ['nombre']
            }],
            order: [['apellido', 'ASC'], ['nombre', 'ASC']],
            limit: registrosPorPagina,
            offset: offset,
            distinct: true // Importante cuando se usa include con limit
        });

        // 4. OBTENER TODOS LOS ROLES PARA EL DROPDOWN DE FILTROS
        const roles = await Rol.findAll({ attributes: ['id', 'nombre'], order: [['nombre', 'ASC']] });

        // 5. PREPARAR DATOS PARA LA VISTA
        const totalPaginas = Math.ceil(count / registrosPorPagina);
        const filtros = { dni, nombre, email, rol_id, activo }; // Objeto con posibles undefined

        // Limpiamos el objeto de filtros para que no contenga claves con valor undefined o ''
        Object.keys(filtros).forEach(key => {
            if (filtros[key] === undefined || filtros[key] === '') {
                delete filtros[key];
            }
        });

        // Creamos una cadena de consulta para los enlaces de paginación
        const filtrosQuery = new URLSearchParams(filtros).toString();

        res.render('./Usuario/Listar.pug', {
            title: 'Listado de Usuarios',
            usuarios: usuarios,
            roles: roles,
            paginacion: {
                totalRegistros: count,
                totalPaginas: totalPaginas,
                paginaActual: parseInt(pagina),
                registrosPorPagina: registrosPorPagina
            },
            filtros: filtros,
            filtrosQuery: filtrosQuery
        });
    } catch (error) {
        console.error('Error al obtener la lista de usuarios:', error);
        res.status(500).send('Error interno del servidor al cargar la página.');
        next(error);
    }
};


exports.getAusencia = async (req, res, next) => {
  try {
    const usuarioId = req.params.id;
    const { year, month } = req.query;

    const usuario = await Usuario.findByPk(usuarioId, {
      attributes: ['id', 'nombre', 'apellido']
    });

    if (!usuario) {
      return res.redirect('/usuarios');
    }

    const whereClause = { usuario_id: usuarioId };
    if (req.usuario.Rol.nombre == 'Medico') whereClause.activo = true;
    if (year) {
      const startDate = new Date(year, month ? month - 1 : 0, 1);
      const endDate = new Date(year, month ? month : 12, 0);
      whereClause[Op.and] = [
        { fecha_inicio: { [Op.lte]: endDate } },
        { fecha_fin: { [Op.gte]: startDate } }
      ];
    }

    const agendas = await Agenda.findAll({
      where: whereClause,
      order: [['fecha_inicio', 'ASC']]
    });

    const eventosParaCalendario = agendas.filter(agenda => agenda.activo).map(agenda => {
      const endDate = new Date(agenda.fecha_fin);
      endDate.setDate(endDate.getDate() + 1);

      return {
        title: agenda.motivo || 'No disponible',
        start: agenda.fecha_inicio,
        end: endDate.toISOString().split('T')[0],
        allDay: true
      };
    });

    res.render('./Usuario/Agenda.pug', {
      title: `Agenda de ${usuario.nombre} ${usuario.apellido}`,
      usuario: usuario,
      agendas: agendas,
      eventosParaCalendario: eventosParaCalendario,
      filtros: { year, month },
      añosDisponibles: [new Date().getFullYear(), new Date().getFullYear() + 1]
    });
  } catch (error) {
    next(error);
  }
}


exports.getHorarios = async (req, res, next) => {
    try {
        const usuarioId = req.params.id;
        const { fecha, activo, pagina = 1 } = req.query;
        const registrosPorPagina = 13;
        const offset = (pagina - 1) * registrosPorPagina;

        const usuario = await Usuario.findByPk(usuarioId);

        if (!usuario) {
            return res.redirect('/usuarios');
        }

        const whereClause = { usuario_id: usuarioId };
        if (fecha) whereClause.fecha = fecha;
        if (activo !== undefined && activo !== '') whereClause.activo = activo === 'true';

        const { count, rows: horarios } = await Horario.findAndCountAll({
            where: whereClause,
            order: [['hora_inicio', 'ASC']],
            limit: registrosPorPagina,
            offset: offset
        });

        const totalPaginas = Math.ceil(count / registrosPorPagina);

        const filtros = { fecha, activo };
        Object.keys(filtros).forEach(key => {
            if (filtros[key] === undefined || filtros[key] === '') {
                delete filtros[key];
            }
        });
        const filtrosQuery = new URLSearchParams(filtros).toString();

        res.render('./Usuario/Horarios.pug', {
            title: `Horarios de ${usuario.nombre} ${usuario.apellido}`,
            usuario: usuario,
            horarios: horarios,
            paginacion: {
                paginaActual: parseInt(pagina),
                totalPaginas,
                totalRegistros: count,
                registrosPorPagina: registrosPorPagina
            },
            filtros: filtros,
            filtrosQuery: filtrosQuery
        });
    } catch (error) {
        next(error);
    }
};