const { Habitacion, Cama, Ala, sequelize } = require('../db/models');
const { Op } = require('sequelize');

exports.registerHabitacion = async (habitacionData) => {
    const habitacion = await Habitacion.findOne({ where: { numero: habitacionData.numero } });
    if (habitacion) {
        throw new Error('El numero ya está en uso');
    }

    try {
        const nuevaHabitacion = await Habitacion.create({
            numero: habitacionData.numero,
            capacidad: habitacionData.capacidad,
            descripcion: habitacionData.descripcion,
            ala_id: habitacionData.ala_id,
            activo: true
        });
        return nuevaHabitacion;
    } catch (error) {
        throw new Error('Error al registrar la habitacion');
    }
}

exports.getListarHabitaciones = async (filtros, pagina, porPagina) => {
    const whereClause = {};
    if (filtros.numero) whereClause.numero = { [Op.iLike]: `%${filtros.numero}%` };
    if (filtros.capacidad) whereClause.capacidad = filtros.capacidad;
    if (filtros.activo !== '') whereClause.activo = filtros.activo === 'true';
    if (filtros.ala_id) whereClause.ala_id = filtros.ala_id;

    const subqueryCamasLibres = `(SELECT COUNT(*) FROM "Camas" AS c WHERE c.habitacion_id = "Habitacion".id AND c.estado = 'Libre' AND c.activo = true)`;

    if (filtros.conCamasLibres === 'true') {
        whereClause[Op.and] = sequelize.literal(`${subqueryCamasLibres} > 0`);
    } else if (filtros.conCamasLibres === 'false') {
        whereClause[Op.and] = sequelize.literal(`${subqueryCamasLibres} = 0`);
    }

    const { count, rows } = await Habitacion.findAndCountAll({
        where: whereClause,
        include: [{ model: Ala, as: 'ala', attributes: ['nombre'] }],
        attributes: {
            include: [
                [sequelize.literal(subqueryCamasLibres), 'camasLibres']
            ]
        },
        limit: porPagina,
        offset: (pagina - 1) * porPagina,
        order: [['numero', 'ASC']],
        distinct: true,
    });

    return {
        habitaciones: rows,
        totalRegistros: count
    };
};

exports.editHabitacion = async (id, datosActualizados) => {
    try {
        const habitacion = await Habitacion.findByPk(id);
        if (!habitacion) {
            throw new Error('Habitacion no encontrada');
        }

        const numeroUsado = await Habitacion.findOne({ where: { numero: datosActualizados.numero } });
        if (numeroUsado && numeroUsado.id != id) {
            throw new Error('El numero ya está en uso');
        }


        const atributosEditables = {
            numero: datosActualizados.numero,
            capacidad: datosActualizados.capacidad,
            descripcion: datosActualizados.descripcion
        }

        await Habitacion.update(atributosEditables, { where: { id: id } });
        
        const habitacionActualizada = await Habitacion.findByPk(id);
        return habitacionActualizada;
    } catch (error) {
        throw error;
    }
}

exports.moverHabitacion = async (id, ala_id) => {
    try {
        const habitacion = await Habitacion.findByPk(id);
        if (!habitacion) {
            throw new Error('Habitacion no encontrada');
        }

        if (habitacion.ala_id == ala_id){
            throw new Error('La habitacion ya se encuentra en la ala');
        }

        habitacion.ala_id = ala_id;

        await habitacion.save();
        return habitacion;
    } catch (error) {
        throw error;
    }
}

exports.setActivo = async (id, activo) => {
    try {
        const resultado = await sequelize.transaction(async (t) => {
            const habitacion = await Habitacion.findByPk(id, { transaction: t });
            if (!habitacion) {
                throw new Error('Habitacion no encontrada');
            }

            if (habitacion.activo === activo) {
                throw new Error(`La habitacion ya se encuentra ${activo ? 'activo' : 'inactivo'}.`);
            }

            if (!activo) {
                const camasOcupadas = await Cama.count({
                    where: {
                        habitacion_id: id,
                        estado: { [Op.ne]: 'Libre' }
                    },
                    transaction: t
                });

                if (camasOcupadas > 0) {
                    throw new Error('No se puede desactivar la habitación porque tiene camas ocupadas.');
                }

                await Cama.update({ activo: false }, { where: { habitacion_id: id }, transaction: t });
            }

            habitacion.activo = activo;
            await habitacion.save({ transaction: t });
            return habitacion;
        });
        return resultado;
    } catch (error) {
        throw error;
    }
}

exports.getHabitacion = async (id) => {
    const habitacion = await Habitacion.findByPk(id, {
        include: [{
            model: Ala,
            as: 'ala',
            attributes: ['id', 'nombre']
        }]
    });

    if (!habitacion) throw new Error('Habitacion no encontrada');

    return habitacion;
};

exports.getHabitaciones = async (numero, ala_id = null) => {
    try {
        const where = {
            numero: { [Op.iLike]: `%${numero}%`},
            activo: true
        };
        if (ala_id) where.ala_id = ala_id;

        where[Op.and] = sequelize.literal(`
            "Habitacion"."capacidad" > (SELECT COUNT(*) FROM "Camas" AS c WHERE c.habitacion_id = "Habitacion".id AND c.activo = true)
        `);

        const habitaciones = await Habitacion.findAll({
            where: where,
            limit: 10
        });

        return habitaciones;
    } catch (error) {
        throw new Error('Error al realizar la búsqueda de las habitaciones.');
    }
}