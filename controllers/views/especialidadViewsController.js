const { Especialidad } = require('../../db/models');
const { Op } = require('sequelize');

exports.getListar = async (req, res, next) => {
    try {
        const { nombre, activo, pagina = 1 } = req.query;
        const registrosPorPagina = 13;
        const offset = (pagina - 1) * registrosPorPagina;

        const whereClause = {};
        if (nombre) whereClause.nombre = { [Op.iLike]: `%${nombre}%` };
        if (activo !== undefined && activo !== '') whereClause.activo = activo === 'true';

        const { count, rows: especialidades } = await Especialidad.findAndCountAll({
            where: whereClause,
            order: [['nombre', 'ASC']],
            limit: registrosPorPagina,
            offset: offset,
            distinct: true
        });

        const totalPaginas = Math.ceil(count / registrosPorPagina);
        const filtros = { nombre, activo };

        Object.keys(filtros).forEach(key => {
            if (filtros[key] === undefined || filtros[key] === '') {
                delete filtros[key];
            }
        });

        const filtrosQuery = new URLSearchParams(filtros).toString();

        res.render('./Especialidad/Listar.pug', {
            title: 'Listado de Especialidades',
            especialidades: especialidades,
            paginacion: {
                totalRegistros: count,
                totalPaginas: totalPaginas,
                paginaActual: parseInt(pagina),
            },
            filtros: filtros,
            filtrosQuery: filtrosQuery
        });
    } catch (error) {
        console.error('Error al obtener la lista de especialidades:', error);
        next(error);
    }
};