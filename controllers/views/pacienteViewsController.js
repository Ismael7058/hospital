const { Paciente, Nacionalidad, Identificacion, PacienteSeguro, SeguroMedico, AntecedentePaciente, TiposAtencedentes, FuentesInformacion } = require('../../db/models');
const { Op } = require('sequelize');

const REGISTROS_POR_PAGINA = 13;

const buildWhereClause = (filtros) => {
    const whereClause = {};
    const { nombre, email, telefono, activo } = filtros;

    if (nombre) {
        whereClause[Op.or] = [
            { nombre: { [Op.iLike]: `%${nombre}%` } },
            { apellido: { [Op.iLike]: `%${nombre}%` } }
        ];
    }
    if (email) whereClause.email = { [Op.like]: `%${email}%` };
    if (telefono) whereClause.telefono = { [Op.like]: `%${telefono}%` };
    if (activo !== undefined && activo !== '') whereClause.activo = activo === 'true';

    return whereClause;
};

exports.getListaPaciente = async (req, res, next) => {
    try {
        // 1. OBTENER PARÁMETROS DE FILTRO Y PAGINACIÓN DE LA URL (req.query)
        const { pagina = 1, ...filtrosQuery } = req.query;
        const offset = (pagina - 1) * REGISTROS_POR_PAGINA;

        // 2. CONSTRUIR LA CLÁUSULA 'WHERE' DINÁMICAMENTE
        const whereClause = buildWhereClause(filtrosQuery);

        const includeClause = [
            {
                model: Nacionalidad,
                as: 'nacionalidades',
                attributes: ['nombre'],
                through: { attributes: [] }
            },
            {
                model: Identificacion,
                as: 'identificaciones',
                attributes: ['tipo_doc', 'nro_doc'],
                // where clause para el include de identificaciones
                where: {} 
            }
        ];

        if (filtrosQuery.nacionalidad_id) {
            includeClause[0].where = { id: filtrosQuery.nacionalidad_id };
            includeClause[0].required = true; // INNER JOIN
        }

        // Aplicar filtros de identificación
        if (filtrosQuery.tipo_doc) includeClause[1].where.tipo_doc = filtrosQuery.tipo_doc;
        if (filtrosQuery.nro_doc) includeClause[1].where.nro_doc = { [Op.like]: `%${filtrosQuery.nro_doc}%` };
        // Si hay filtros de identificación, la relación es obligatoria (INNER JOIN)
        if (filtrosQuery.tipo_doc || filtrosQuery.nro_doc) includeClause[1].required = true;

        // 3. REALIZAR LA CONSULTA CON FILTROS Y PAGINACIÓN
        const { count, rows: pacientes } = await Paciente.findAndCountAll({
            where: whereClause,
            include: includeClause,
            order: [['apellido', 'ASC'], ['nombre', 'ASC'], [ { model: Identificacion, as: 'identificaciones' }, 'tipo_doc', 'ASC' ]],
            limit: REGISTROS_POR_PAGINA,
            offset: offset,
            distinct: true
        });

        // 4. OBTENER TODAS LAS NACIONALIDADES PARA EL DROPDOWN DE FILTROS
        const nacionalidades = await Nacionalidad.findAll({ 
            attributes: ['id', 'nombre'], 
            order: [['nombre', 'ASC']] 
        });

        // 5. PREPARAR DATOS PARA LA VISTA
        const totalPaginas = Math.ceil(count / REGISTROS_POR_PAGINA);
        const filtrosActivos = Object.fromEntries(Object.entries(filtrosQuery).filter(([, value]) => value));
        const filtrosQueryString = new URLSearchParams(filtrosActivos).toString();

        res.render('./Paciente/Listar.pug', {
            title: 'Listado de Pacientes',
            pacientes: pacientes,
            nacionalidades: nacionalidades,
            paginacion: {
                registrosPorPagina: REGISTROS_POR_PAGINA,
                totalRegistros: count,
                totalPaginas: totalPaginas,
                paginaActual: parseInt(pagina)
            },
            filtros: filtrosQuery,
            filtrosQuery: filtrosQueryString
        });
    } catch (error) {
        next(error);
    }
};


exports.getRegistrar = async (req, res, next) => {
    try {
        // Nacionalidades para el selector de Tagify
        const nacionalidades = await Nacionalidad.findAll({
            attributes: ['id', 'nombre'],
            order: [['nombre', 'ASC']]
        });

        res.render('./Paciente/Registrar.pug', {
            title: 'Registrar Paciente',
            nacionalidadesList: nacionalidades,
            old: {},
            errors: []
        });
    } catch (error) {
        next(error);
    }
};


exports.getPaciente = async (req, res, next) => {
    try {
        const pacienteId = req.params.id;

        const [paciente, nacionalidadesList] = await Promise.all([
            Paciente.findByPk(pacienteId, {
                include: [
                    { model: Nacionalidad, as: 'nacionalidades', through: { attributes: [] } },
                    { model: Identificacion, as: 'identificaciones' }
                ]
            }),
            Nacionalidad.findAll({
                attributes: ['id', 'nombre'],
                order: [['nombre', 'ASC']]
            })
        ]);

        if (!paciente) {
            return res.redirect('/pacientes');
        }

        res.render('./Paciente/Gestion.pug', {
            title: `Gestionar Paciente: ${paciente.nombre} ${paciente.apellido}`,
            paciente: paciente,
            nacionalidadesList: nacionalidadesList
        });
    } catch (error) {
        next(error);
    }
};

exports.getSeguros = async (req, res, next) => {
    try {
        const pacienteId = req.params.id;
        const { estado, vencimiento, pagina = 1 } = req.query;
        const offset = (pagina - 1) * REGISTROS_POR_PAGINA;

        // 1. Obtener Paciente con sus identificaciones
        const paciente = await Paciente.findByPk(pacienteId, {
            include: [{ model: Identificacion, as: 'identificaciones' }]
        });

        if (!paciente) {
            return res.redirect('/pacientes');
        }

        // Preparar datos del paciente (extraer DNI para la vista si existe)
        const pacienteData = paciente.toJSON();
        if (pacienteData.identificaciones && pacienteData.identificaciones.length > 0) {
            pacienteData.dni = pacienteData.identificaciones[0].nro_doc;
        }

        // 2. Construir filtros para los seguros del paciente
        const whereClause = { paciente_id: pacienteId };

        if (estado === 'true') whereClause.activo = true;
        if (estado === 'false') whereClause.activo = false;

        if (vencimiento === 'proximos') {
            const today = new Date();
            const next30Days = new Date();
            next30Days.setDate(today.getDate() + 30);
            whereClause.fecha_expiracion = { [Op.between]: [today, next30Days] };
        } else if (vencimiento === 'vencidos') {
            whereClause.fecha_expiracion = { [Op.lt]: new Date() };
        }

        // 3. Obtener los seguros asignados al paciente
        const { count, rows: pacienteSeguros } = await PacienteSeguro.findAndCountAll({
            where: whereClause,
            include: [{ model: SeguroMedico, attributes: ['id', 'nombre'] }],
            order: [['activo', 'DESC'], ['fecha_expiracion', 'ASC']],
            limit: REGISTROS_POR_PAGINA,
            offset: offset
        });

        // 4. Obtener lista de Seguros Médicos activos para el modal de registro
        const seguros = await SeguroMedico.findAll({
            where: { activo: true },
            order: [['nombre', 'ASC']]
        });

        const totalPaginas = Math.ceil(count / REGISTROS_POR_PAGINA);
        const filtrosActivos = Object.fromEntries(Object.entries({ estado, vencimiento }).filter(([, value]) => value));
        const filtrosQuery = new URLSearchParams(filtrosActivos).toString();

        res.render('./Paciente/SegurosPaciente.pug', {
            title: 'Seguros del Paciente',
            paciente: pacienteData,
            pacienteSeguros,
            seguros,
            filtros: { estado, vencimiento },
            filtrosQuery,
            paginacion: {
                paginaActual: parseInt(pagina),
                totalPaginas,
                totalRegistros: count,
                registrosPorPagina: REGISTROS_POR_PAGINA
            }
        });
    } catch (error) {
        next(error);
    }
};


exports.getAntecedentes = async (req, res, next) => {
    try {
        const pacienteId = req.params.id;
        const { tipo_antecedente_id, fecha_inicio, fecha_fin, validado, activo, pagina = 1 } = req.query;
        const offset = (pagina - 1) * REGISTROS_POR_PAGINA;

        const paciente = await Paciente.findByPk(pacienteId, {
          include: {
           model: Identificacion, as: 'identificaciones', attributes: ['tipo_doc', 'nro_doc']
          }
        });
        if (!paciente) {
            return res.redirect('/pacientes');
        }

        const whereClause = { paciente_id: pacienteId };
        if (tipo_antecedente_id) whereClause.tipo_antecedente_id = tipo_antecedente_id;
        
        if (fecha_inicio && fecha_fin) {
            whereClause.fecha_registro = { [Op.between]: [fecha_inicio, fecha_fin] };
        } else if (fecha_inicio) {
            whereClause.fecha_registro = { [Op.gte]: fecha_inicio };
        } else if (fecha_fin) {
            whereClause.fecha_registro = { [Op.lte]: fecha_fin };
        }

        if (validado !== undefined && validado !== '') whereClause.validado = validado === 'true';
        if (activo !== undefined && activo !== '') whereClause.activo = activo === 'true';

        const { count, rows: antecedentes } = await AntecedentePaciente.findAndCountAll({
            where: whereClause,
            include: [
                { model: TiposAtencedentes, where: { activo: true } },
                { model: FuentesInformacion, where: { activo: true } }
            ],
            order: [['fecha_registro', 'DESC']],
            limit: REGISTROS_POR_PAGINA,
            offset: offset
        });

        const tiposAntecedentes = await TiposAtencedentes.findAll({ where: { activo: true }, order: [['nombre', 'ASC']] });
        const fuentesInformacion = await FuentesInformacion.findAll({ where: { activo: true }, order: [['nombre', 'ASC']] });

        const totalPaginas = Math.ceil(count / REGISTROS_POR_PAGINA);
        
        // Preparar filtros para la vista
        const filtros = { tipo_antecedente_id, fecha_inicio, fecha_fin, validado, activo };
        Object.keys(filtros).forEach(key => {
            if (filtros[key] === undefined || filtros[key] === '') delete filtros[key];
        });
        const filtrosQuery = new URLSearchParams(filtros).toString();

        res.render('./Paciente/Antecedentes.pug', {
            title: `Antecedentes Clínicos: ${paciente.nombre} ${paciente.apellido}`,
            paciente,
            antecedentes,
            tiposAntecedentes,
            fuentesInformacion,
            paginacion: {
                paginaActual: parseInt(pagina),
                totalPaginas,
                totalRegistros: count,
                registrosPorPagina: REGISTROS_POR_PAGINA
            },
            filtros,
            filtrosQuery
        });
    } catch (error) {
        next(error);
    }
};