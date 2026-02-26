const { Matricula, Usuario } = require('../../db/models');
const { Op } = require('sequelize');

exports.getRegistrar = async (req, res, next) => {
    try {
        res.render('./Matricula/Registrar.pug', {
            title: 'Registrar Nueva Matrícula'
        });
    } catch (error) {
        next(error);
    }
};

exports.getMatricula = async (req, res, next) => {
    try {
        const matriculaId = req.params.id;
        
        const matricula = await Matricula.findByPk(matriculaId, {
            include: [{
                model: Usuario,
                attributes: ['dni', 'nombre', 'apellido']
            }]
        });

        if (!matricula) {
            return res.redirect('/matriculas/Listar');
        }

        res.render('./Matricula/Gestion.pug', {
            title: `Gestión de Matrícula: ${matricula.numero}`,
            matricula: matricula
        });
    } catch (error) {
        next(error);
    }
}

exports.getListar = async (req, res, next) => {
    try {
        const { numero, tipo, entidad_emisora, usuario, activo, pagina = 1 } = req.query;
        const registrosPorPagina = 13;
        const offset = (pagina - 1) * registrosPorPagina;

        const whereClause = {};
        if (numero) whereClause.numero = { [Op.like]: `%${numero}%` };
        if (tipo) whereClause.tipo = { [Op.like]: `%${tipo}%` };
        if (entidad_emisora) whereClause.entidad_emisora = { [Op.like]: `%${entidad_emisora}%` };
        if (activo !== undefined && activo !== '') whereClause.activo = activo === 'true';

        const includeWhereClause = {};
        if (usuario) {
            includeWhereClause[Op.or] = [
                { nombre: { [Op.like]: `%${usuario}%` } },
                { apellido: { [Op.like]: `%${usuario}%` } },
                { dni: { [Op.like]: `%${usuario}%` } }
            ];
        }

        const { count, rows: matriculas } = await Matricula.findAndCountAll({
            where: whereClause,
            include: [{
                model: Usuario,
                attributes: ['id', 'nombre', 'apellido'],
                where: includeWhereClause,
                required: true
            }],
            order: [['fecha_vencimiento', 'ASC']],
            limit: registrosPorPagina,
            offset: offset,
            distinct: true
        });

        const totalPaginas = Math.ceil(count / registrosPorPagina);
        const filtros = { numero, tipo, entidad_emisora, usuario, activo };

        Object.keys(filtros).forEach(key => {
            if (!filtros[key]) {
                delete filtros[key];
            }
        });

        const filtrosQuery = new URLSearchParams(filtros).toString();
        
        res.render('./Matricula/Listar.pug', {
            title: 'Listado de Matrículas',
            matriculas: matriculas,
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