const { Ala, Habitacion, Cama, sequelize } = require('../../db/models');
const { Op } = require('sequelize');
const camaServices = require('../../services/camaServices');
const alaServices = require('../../services/alaServices');
const habitacionServices = require('../../services/habitacionServices');

exports.getDashboard = async (req, res, next) => {
    try {
        const totalAlas = await Ala.count();
        const totalHabitaciones = await Habitacion.count();
        const totalCamas = await Cama.count();
        const camasOcupadas = await Cama.count({ where: { estado: 'Libre' } });

        const camasDisponibles = totalCamas - camasOcupadas;
        const tasaOcupacion = totalCamas > 0 ? ((camasOcupadas / totalCamas) * 100).toFixed(2) : 0;

        const alasConDetalles = await Ala.findAll({
            include: {
                model: Habitacion,
                as: 'habitaciones',
                include: {
                    model: Cama,
                    as: 'camas'
                }
            }
        });

        res.render('./Infraestructura/Dashboard.pug', {
            title: 'Gestión de Infraestructura',
            stats: { totalAlas, totalHabitaciones, totalCamas, camasDisponibles, tasaOcupacion },
            alas: alasConDetalles
        });
    } catch (error) {
        next(error);
    }
};

exports.getListarAlas = async (req, res, next) => {
    try {
        const pagina = parseInt(req.query.pagina, 10) || 1;
        const porPagina = 13;

        const { alas, totalRegistros } = await alaServices.getListarAlas(pagina, porPagina);

        const totalPaginas = Math.ceil(totalRegistros / porPagina);

        const filtros = {};
        const filtrosQuery = new URLSearchParams(filtros).toString();

        res.render('./Infraestructura/Alas.pug', {
            title: 'Gestionar Alas',
            alas: alas,
            paginacion: {
                paginaActual: pagina,
                totalPaginas,
                totalRegistros
            },
            filtros,
            filtrosQuery
        });
    } catch (error) {
        next(error);
    }
};

exports.getListarHabitaciones = async (req, res, next) => {
    try {
        const pagina = parseInt(req.query.pagina, 10) || 1;
        const porPagina = 13;

        const filtros = {
            numero: req.query.numero || '',
            capacidad: req.query.capacidad || '',
            activo: req.query.activo || '',
            ala_id: req.query.ala_id || '',
            conCamasLibres: req.query.conCamasLibres || ''
        };

        const { habitaciones, totalRegistros } = await habitacionServices.getListarHabitaciones(filtros, pagina, porPagina);

        const alas = await Ala.findAll({ where: { activo: true }, order: [['nombre', 'ASC']] });

        const totalPaginas = Math.ceil(totalRegistros / porPagina);
        const filtrosQuery = new URLSearchParams(filtros).toString();

        res.render('./Infraestructura/Habitaciones.pug', {
            title: 'Gestionar Habitaciones',
            habitaciones,
            alas,
            paginacion: {
                paginaActual: pagina,
                totalPaginas,
                totalRegistros
            },
            filtros,
            filtrosQuery
        });
    } catch (error) {
        next(error);
    }
};

exports.getListarCamas = async (req, res, next) => {
    try {
        const pagina = parseInt(req.query.pagina, 10) || 1;
        const porPagina = 13;

        const filtros = {
            codigo: req.query.codigo || '',
            estado: req.query.estado || '',
            activo: req.query.activo || '',
            ala_id: req.query.ala_id || '',
            habitacion_id: req.query.habitacion_id || ''
        };

        const { camas, totalRegistros } = await camaServices.getListarCamas(filtros, pagina, porPagina);

        const [alas, habitaciones] = await Promise.all([
            Ala.findAll({ where: { activo: true }, order: [['nombre', 'ASC']] }),
            Habitacion.findAll({ where: { activo: true }, order: [['numero', 'ASC']] })
        ]);

        const totalPaginas = Math.ceil(totalRegistros / porPagina);
        const filtrosQuery = new URLSearchParams(filtros).toString();

        res.render('./Infraestructura/Camas.pug', {
            title: 'Gestionar Camas',
            camas,
            alas,
            habitaciones,
            paginacion: {
                paginaActual: pagina,
                totalPaginas,
                totalRegistros
            },
            filtros,
            filtrosQuery
        });
    } catch (error) {
        next(error);
    }
};
