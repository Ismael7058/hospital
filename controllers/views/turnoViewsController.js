const { Turno, Usuario, Paciente, Rol, Identificacion, ViaIngreso } = require('../../db/models');
const { Op } = require('sequelize');

exports.getTurnos = async (req, res, next) => {
    try {
        const { fecha, estado, medico_id, medico, paciente, activo, pagina = 1 } = req.query;
        const registrosPorPagina = 13;
        const offset = (pagina - 1) * registrosPorPagina;

        const whereClause = {};

        // Filtro por fecha (rango del día completo)
        if (fecha) {
            whereClause.fecha = fecha;
        }

        if (estado) whereClause.estado = estado;
        if (medico_id) whereClause.medico_id = medico_id;
        if (activo !== undefined && activo !== '') whereClause.activo = activo === 'true';

        // Configurar relaciones (includes)
        const includeOptions = [
            { model: Usuario, as: 'medico', attributes: ['id', 'nombre', 'apellido'] },
            { model: Paciente, as: 'paciente', attributes: ['id', 'nombre', 'apellido'] }
        ];

        // Filtro de Medico (Búsqueda por nombre, apellido o DNI)
        if (medico) {
            includeOptions[0].where = {
                [Op.or]: [
                    { nombre: { [Op.like]: `%${medico}%` } },
                    { apellido: { [Op.like]: `%${medico}%` } },
                    { dni: { [Op.like]: `%${medico}%` } }
                ]
            };
            includeOptions[0].required = true;
        }

        // Filtro de Paciente (Búsqueda por nombre o apellido)
        if (paciente) {
            includeOptions[1].where = {
                [Op.or]: [
                    { nombre: { [Op.like]: `%${paciente}%` } },
                    { apellido: { [Op.like]: `%${paciente}%` } }
                ]
            };
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

        // Obtener lista de médicos para el filtro (Usuarios con Rol 'Medico')
        const rolMedico = await Rol.findOne({ where: { nombre: 'Medico' } });
        const medicos = rolMedico ? await Usuario.findAll({
            where: { rol_id: rolMedico.id, activo: true },
            attributes: ['id', 'nombre', 'apellido'],
            order: [['apellido', 'ASC']]
        }) : [];

        const totalPaginas = Math.ceil(count / registrosPorPagina);
        const filtros = { fecha, estado, medico_id, medico, paciente, activo };

        Object.keys(filtros).forEach(key => {
            if (filtros[key] === undefined || filtros[key] === '') {
                delete filtros[key];
            }
        });

        const filtrosQuery = new URLSearchParams(filtros).toString();

        res.render('./Turno/Listar.pug', {
            title: 'Listado de Turnos',
            turnos: turnos,
            medicos: medicos,
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

        // Si viene un ID de médico (usuario_id), buscamos sus datos
        if (usuario_id) {
            medicoPreseleccionado = await Usuario.findByPk(usuario_id, {
                attributes: ['id', 'nombre', 'apellido', 'dni']
            });
        }

        // Si viene un ID de paciente, buscamos sus datos e identificación
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