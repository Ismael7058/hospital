const { Matricula, Usuario } = require('../../db/models');
const { Op } = require('sequelize');

exports.getRegistrar = async (req, res, next) => {
    try {
        res.render('./Matricula/Registrar.pug', {
            title: 'Registrar Nueva Matrícula'
        });
    } catch (error) {
        console.error('Error al renderizar la página de registro de matrícula:', error);
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
        console.error('Error al renderizar la vista de gestión de matrícula:', error);
        next(error); // Pasamos el error al manejador global
    }
}

exports.getListar = async (req, res, next) => {
    try {
        // 1. OBTENER PARÁMETROS DE FILTRO Y PAGINACIÓN
        const { numero, tipo, entidad_emisora, usuario, activo, pagina = 1 } = req.query;
        const registrosPorPagina = 13;
        const offset = (pagina - 1) * registrosPorPagina;

        // 2. CONSTRUIR LA CLÁUSULA 'WHERE' DINÁMICAMENTE
        const whereClause = {};
        if (numero) whereClause.numero = { [Op.like]: `%${numero}%` };
        if (tipo) whereClause.tipo = { [Op.like]: `%${tipo}%` };
        if (entidad_emisora) whereClause.entidad_emisora = { [Op.like]: `%${entidad_emisora}%` };
        if (activo !== undefined && activo !== '') whereClause.activo = activo === 'true';

        // Filtro para el modelo asociado (Usuario)
        const includeWhereClause = {};
        if (usuario) {
            includeWhereClause[Op.or] = [
                { nombre: { [Op.like]: `%${usuario}%` } },
                { apellido: { [Op.like]: `%${usuario}%` } },
                { dni: { [Op.like]: `%${usuario}%` } }
            ];
        }

        // 3. REALIZAR LA CONSULTA CON FILTROS Y PAGINACIÓN
        const { count, rows: matriculas } = await Matricula.findAndCountAll({
            where: whereClause,
            include: [{
                model: Usuario,
                attributes: ['id', 'nombre', 'apellido'],
                where: includeWhereClause, // Aplicar filtro en el include
                required: true // INNER JOIN para que solo traiga matrículas de usuarios que coincidan
            }],
            order: [['fecha_vencimiento', 'ASC']],
            limit: registrosPorPagina,
            offset: offset,
            distinct: true
        });

        // 4. PREPARAR DATOS PARA LA VISTA
        const totalPaginas = Math.ceil(count / registrosPorPagina);
        const filtros = { numero, tipo, entidad_emisora, usuario, activo };

        // Limpiamos el objeto de filtros para que no contenga claves con valor undefined o ''
        Object.keys(filtros).forEach(key => {
            if (!filtros[key]) { // Cubre undefined, null, ''
                delete filtros[key];
            }
        });

        // Creamos una cadena de consulta para los enlaces de paginación
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
        console.error('Error al obtener la lista de matrículas:', error);
        next(error);
    }
};