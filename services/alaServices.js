const { Ala, sequelize, Cama, Habitacion } = require('../db/models');

exports.registerAla = async (alaData) => {
    const ala = await Ala.findOne({ where: { nombre: alaData.nombre } });
    if (ala) {
        throw new Error('El nombre ya está en uso');
    }

    const datosParaCrear = {
        ...alaData,
        estado: 'Libre',
        activo: true
    }

    try {
        const newAla = await Ala.create(datosParaCrear);
        return newAla;
    } catch (error) {
        throw error;
    }
}

exports.editAla = async (id, datosActualizados) => {
    const ala = await Ala.findByPk(id);
    if (!ala) {
        throw new Error('Ala no encontrada');
    }

    const nombreUsado = await Ala.findOne( { where: { nombre: datosActualizados.nombre } });
    if (nombreUsado && nombreUsado.id !== id){
        throw new Error('El nombre ya está en uso');
    }

    ala.nombre = datosActualizados.nombre;
    await ala.save();
    return ala;
}

exports.setActivo = async (id, activo) => {
    try {
        const resultado = await sequelize.transaction(async (t) => {
            const ala = await Ala.findByPk(id, { transaction: t });
            if (!ala) {
                throw new Error('Ala no encontrada');
            }

            if (ala.activo === activo) {
                throw new Error(`El ala ya se encuentra ${activo ? 'activa' : 'inactiva'}.`);
            }

            if (!activo) {
                const camasEstado = await Cama.count({
                    include: [{
                        model: Habitacion,
                        required: true,
                        where: { ala_id: id },
                        attributes: []
                    }],
                    where: { estado: 'Libre' },
                    transaction: t
                });

                if (camasEstado > 0) {
                    throw new Error('No se puede desactivar el ala porque tiene camas ocupadas.');
                }

                // Desactivar en cascada: Camas y luego Habitaciones
                const habitacionIds = await Habitacion.findAll({ where: { ala_id: id }, attributes: ['id'], raw: true, transaction: t });
                const ids = habitacionIds.map(h => h.id);
                await Cama.update({ activo: false }, { where: { habitacion_id: ids }, transaction: t });
                await Habitacion.update({ activo: false }, { where: { ala_id: id }, transaction: t });
            }

            ala.activo = activo;
            await ala.save({ transaction: t });
            return ala;
        });
        return resultado;
    } catch (error) {
        throw error;
    }
}

exports.getListarAlas = async () => {
    const alas = await Ala.findAll({
        attributes: {
            include: [
                [
                    sequelize.literal(`(
                        SELECT COUNT(*)
                        FROM "Habitaciones" AS h
                        WHERE h.ala_id = "Ala".id
                    )`),
                    'cantidadHabitaciones'
                ]
            ]
        },
        order: [['nombre', 'ASC']],
    });
    return alas;
};