const bcrypt = require('bcrypt');
const { Usuario, Rol, Matricula, Paciente, Cama, Turno, Ala, Habitacion, PacienteSeguro, Admision, ViaIngreso, UbicacionInternacion, AdmisionEnfermero } = require('../db/models');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { adaptarFecha } = require('../helper/fecha');

exports.loginUser = async (email, password) => {
    const usuario = await Usuario.findOne({ 
        where: { email },
        include: [{ model: Rol, attributes: ['nombre'] }]
    });

    if (!usuario) {
        throw new Error('Credenciales inválidas');
    }

    const esPasswordValida = await bcrypt.compare(password, usuario.password_hash);
    if (!esPasswordValida) {
        throw new Error('Credenciales inválidas');
    }

    if (!usuario.activo) {
        throw new Error('Esta cuenta de usuario ha sido desactivada.');
    }

    const payload = {
        id: usuario.id,
        rol: usuario.Rol.nombre
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });
    
    return { token, usuario };
};


exports.getDashboardAdministrador = async () => {
    const hoy = adaptarFecha(new Date());
    hoy.setHours(0, 0, 0, 0);
    const manana = new Date(hoy);
    manana.setDate(hoy.getDate() + 1);

    const proximoMes = new Date();
    proximoMes.setDate(hoy.getDate() + 30);

    // --- Consultas en paralelo para mayor eficiencia ---
    const [
        pacientesActivos,
        totalCamas,
        camasLibres,
        camasLimpieza,
        turnosHoyCount,
        turnosCanceladosHoy,
        admisionesHoy,
        altasHoy,
        pacientesEnEspera,
        matriculasVencidas,
        matriculasPorVencer,
        pacientesConSeguro,
        turnosSinMedico,
        turnosHoyList,
        alas,
        viaEmergencia
    ] = await Promise.all([
        // KPIs
        Paciente.count({ where: { activo: true } }),
        Cama.count({ where: { activo: true } }),
        Cama.count({ where: { estado: 'Libre', activo: true } }),
        Cama.count({ where: { estado: 'Higienizando', activo: true } }),
        Turno.count({ where: { fecha: { [Op.gte]: hoy, [Op.lt]: manana }, activo: true } }),
        Turno.count({ where: { fecha: { [Op.gte]: hoy, [Op.lt]: manana }, estado: 'Cancelado', activo: true } }),
        Admision.count({ where: { fecha_hora_ingreso: { [Op.gte]: hoy, [Op.lt]: manana } } }),
        UbicacionInternacion.count({ where: { fecha_hora_liberacion: { [Op.gte]: hoy, [Op.lt]: manana } } }),
        Admision.count({ where: { estado_atencion: 'En Espera', estado: 'Activa', activo: true } }),
        // Alertas
        Matricula.count({ where: { fecha_vencimiento: { [Op.lt]: new Date() }, activo: true } }),
        Matricula.count({ where: { activo: true, fecha_vencimiento: { [Op.between]: [new Date(), proximoMes] } } }),
        PacienteSeguro.count({ distinct: true, col: 'paciente_id', where: { activo: true, fecha_expiracion: { [Op.gte]: new Date() } } }),
        Turno.count({ where: { medico_id: null, fecha: { [Op.gte]: hoy }, activo: true } }),
        // Listas y estructuras
        Turno.findAll({
            where: { fecha: { [Op.gte]: hoy, [Op.lt]: manana }, activo: true },
            include: [
                { model: Paciente, as: 'paciente', attributes: ['id', 'nombre', 'apellido'] },
                { model: Usuario, as: 'medico', attributes: ['id', 'nombre', 'apellido'] }
            ],
            order: [['hora_inicio', 'ASC']],
            limit: 10
        }),
        Ala.findAll({
            where: { activo: true },
            include: [{
                model: Habitacion,
                as: 'habitaciones',
                where: { activo: true },
                required: false,
                include: [{
                    model: Cama,
                    as: 'camas',
                    where: { activo: true },
                    required: false,
                    order: [['codigo', 'ASC']]
                }],
                order: [['numero', 'ASC']]
            }],
            order: [['nombre', 'ASC']]
        }),
        // Dependencia para KPI de emergencias
        ViaIngreso.findOne({ where: { nombre: 'Emergencia' }, attributes: ['id'] })
    ]);

    // --- Procesamiento de resultados ---
    let emergenciasHoy = 0;
    if (viaEmergencia) {
        emergenciasHoy = await Admision.count({
            where: {
                via_ingreso_id: viaEmergencia.id,
                fecha_hora_ingreso: { [Op.gte]: hoy, [Op.lt]: manana }
            }
        });
    }

    const camasOcupadas = totalCamas - camasLibres - camasLimpieza;
    const pacientesSinSeguro = Math.max(0, pacientesActivos - pacientesConSeguro);

    return {
        kpis: {
            pacientesActivos,
            camasOcupadas,
            totalCamas,
            camasLibres,
            camasLimpieza,
            turnosHoy: turnosHoyCount,
            turnosCanceladosHoy,
            admisionesHoy,
            altasHoy,
            emergenciasHoy,
            pacientesEnEspera
        },
        turnosHoyList,
        infraestructura: alas,
        alertas: {
            matriculasVencidas,
            matriculasPorVencer,
            pacientesSinSeguro,
            turnosSinMedico,
            conflictos: 0 // Pendiente
        }
    };
};

exports.getDashboardRecepcion = async () => {
    const hoy = adaptarFecha(new Date());
    hoy.setHours(0, 0, 0, 0);
    const manana = new Date(hoy);
    manana.setDate(hoy.getDate() + 1);

    // --- Consultas en paralelo para mayor eficiencia ---
    const [
        pacientesActivos,
        totalCamas,
        camasLibres,
        camasLimpieza,
        turnosHoyCount,
        turnosCanceladosHoy,
        admisionesHoy,
        altasHoy,
        pacientesEnEspera,
        turnosHoyList,
        alas,
        viaEmergencia
    ] = await Promise.all([
        // KPIs
        Paciente.count({ where: { activo: true } }),
        Cama.count({ where: { activo: true } }),
        Cama.count({ where: { estado: 'Libre', activo: true } }),
        Cama.count({ where: { estado: 'Higienizando', activo: true } }),
        Turno.count({ where: { fecha: { [Op.gte]: hoy, [Op.lt]: manana }, activo: true } }),
        Turno.count({ where: { fecha: { [Op.gte]: hoy, [Op.lt]: manana }, estado: 'Cancelado', activo: true } }),
        Admision.count({ where: { fecha_hora_ingreso: { [Op.gte]: hoy, [Op.lt]: manana } } }),
        UbicacionInternacion.count({ where: { fecha_hora_liberacion: { [Op.gte]: hoy, [Op.lt]: manana } } }),
        Admision.count({ where: { estado_atencion: 'En Espera', estado: 'Activa', activo: true } }),
        // Listas y estructuras
        Turno.findAll({
            where: { fecha: { [Op.gte]: hoy, [Op.lt]: manana }, activo: true },
            include: [
                { model: Paciente, as: 'paciente', attributes: ['id', 'nombre', 'apellido'] },
                { model: Usuario, as: 'medico', attributes: ['id', 'nombre', 'apellido'] }
            ],
            order: [['hora_inicio', 'ASC']],
            limit: 10
        }),
        Ala.findAll({
            where: { activo: true },
            include: [
                {
                    model: Habitacion,
                    as: 'habitaciones',
                    where: { activo: true },
                    required: false,
                    include: [{
                        model: Cama,
                        as: 'camas',
                        where: { activo: true },
                        required: false,
                        order: [['codigo', 'ASC']]
                    }],
                    order: [['numero', 'ASC']]
                }
            ],
            order: [['nombre', 'ASC']]
        }),
        // Dependencia para KPI de emergencias
        ViaIngreso.findOne({ where: { nombre: 'Emergencia' }, attributes: ['id'] })
    ]);

    // --- Procesamiento de resultados ---
    let emergenciasHoy = 0;
    if (viaEmergencia) {
        emergenciasHoy = await Admision.count({
            where: {
                via_ingreso_id: viaEmergencia.id,
                fecha_hora_ingreso: { [Op.gte]: hoy, [Op.lt]: manana }
            }
        });
    }

    const camasOcupadas = totalCamas - camasLibres - camasLimpieza;

    return {
        kpis: {
            pacientesActivos,
            camasOcupadas,
            totalCamas,
            camasLibres,
            camasLimpieza,
            turnosHoy: turnosHoyCount,
            turnosCanceladosHoy,
            admisionesHoy,
            altasHoy,
            emergenciasHoy,
            pacientesEnEspera
        },
        turnosHoyList,
        infraestructura: alas,
        alertas: { conflictos: 0 } // Placeholder para futuras alertas de recepción
    };
};


exports.getDashboardMedico = async (usuario) => {
    const hoy = adaptarFecha(new Date());
    hoy.setHours(0, 0, 0, 0);
    const manana = new Date(hoy);
    manana.setDate(hoy.getDate() + 1);

    const [
        turnosHoyCount,
        pacientesInternadosCount,
        turnosHoyList,
        pacientesInternadosList
    ] = await Promise.all([
        // KPIs: Contar turnos pendientes para hoy y pacientes activos asignados
        Turno.count({
            where: {
                medico_id: usuario.id,
                fecha: { [Op.gte]: hoy, [Op.lt]: manana },
                estado: 'Pendiente',
                activo: true
            }
        }),
        Admision.count({
            where: {
                medico_atencion_id: usuario.id,
                estado: 'Activa',
                activo: true
            }
        }),
        // Listas: Próximos turnos del día y pacientes internados a cargo
        Turno.findAll({
            where: {
                medico_id: usuario.id,
                fecha: { [Op.gte]: hoy, [Op.lt]: manana },
                activo: true
            },
            include: [{ model: Paciente, as: 'paciente', attributes: ['id', 'nombre', 'apellido'] }],
            order: [['hora_inicio', 'ASC']],
            limit: 10
        }),
        Admision.findAll({
            where: {
                medico_atencion_id: usuario.id,
                estado: 'Activa',
                activo: true
            },
            include: [
                { model: Paciente, as: 'paciente', attributes: ['id', 'nombre', 'apellido'] },
                {
                    model: UbicacionInternacion,
                    as: 'ubicaciones',
                    order: [['fecha_hora_asignacion', 'DESC']],
                    limit: 1,
                    separate: true,
                    include: [{
                        model: Cama, as: 'cama',
                        include: [{
                            model: Habitacion, as: 'habitacion',
                            include: [{ model: Ala, as: 'ala' }]
                        }]
                    }]
                }
            ],
            limit: 10,
            order: [['fecha_hora_ingreso', 'DESC']]
        })
    ]);

    return {
        kpis: {
            turnosHoy: turnosHoyCount,
            pacientesInternados: pacientesInternadosCount
        },
        turnosHoyList,
        pacientesInternadosList
    };
};

exports.getDashboardEnfermero = async (usuario) => {
    // 1. Obtener los IDs de las admisiones activas asignadas a este enfermero
    const admisionesAsignadas = await AdmisionEnfermero.findAll({
        where: { enfermero_id: usuario.id },
        include: [{
            model: Admision,
            as: 'admision',
            where: { estado: 'Activa', activo: true },
            required: true
        }],
        attributes: ['admision_id']
    });
    const admisionIds = admisionesAsignadas.map(a => a.admision_id);

    // 2. Realizar consultas en paralelo
    const [
        camasLibresCount,
        pacientesAsignadosList
    ] = await Promise.all([
        Cama.count({ where: { estado: 'Libre', activo: true } }),
        Admision.findAll({
            where: { id: { [Op.in]: admisionIds } },
            include: [
                { model: Paciente, as: 'paciente', attributes: ['id', 'nombre', 'apellido'] },
                {
                    model: UbicacionInternacion, as: 'ubicaciones', order: [['fecha_hora_asignacion', 'DESC']], limit: 1, separate: true,
                    include: [{ model: Cama, as: 'cama', include: [{ model: Habitacion, as: 'habitacion', include: [{ model: Ala, as: 'ala' }] }] }]
                }
            ],
            limit: 10,
            order: [['fecha_hora_ingreso', 'DESC']]
        })
    ]);

    return {
        kpis: {
            pacientesAsignados: admisionIds.length,
            camasLibres: camasLibresCount
        },
        pacientesAsignadosList
    };
};

exports.getDashboardLimpieza = async () => {
    const [camasHigienizarCount, camasHigienizarList] = await Promise.all([
        Cama.count({ where: { estado: 'Higienizando', activo: true } }),
        Cama.findAll({
            where: { estado: 'Higienizando', activo: true },
            include: [{ model: Habitacion, as: 'habitacion', include: [{ model: Ala, as: 'ala' }] }],
            order: [[{ model: Habitacion, as: 'habitacion' }, { model: Ala, as: 'ala' }, 'nombre', 'ASC'], [{ model: Habitacion, as: 'habitacion' }, 'numero', 'ASC'], ['codigo', 'ASC']],
            limit: 20
        })
    ]);

    return {
        stats: { camasParaHigienizar: camasHigienizarCount },
        camasHigienizarList
    };
};