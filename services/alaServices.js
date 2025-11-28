const { Ala, sequelize, Cama, Habitacion } = require('../db/models');

exports.registerAla = async (alaData) => {
    const ala = await Ala.findOne({ where: { nombre } });
    if (ala) {
        throw new Error('El nombre ya está en uso');
    }

    const datosParaCrear = {
        ...alaData,
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

    const { nombre } = datosActualizados;

    ala.nombre = nombre;
    await ala.save();
    return ala;
}

exports.setEstado = async (id, activo) => {
    try {
        const resultado = await sequelize.transaction(async (t) => {
            const ala = await Ala.findByPk(id, { transaction: t });
            if (!ala) {
                throw new Error('Ala no encontrada');
            }

            if (ala.activo === activo) {
                throw new Error(`El ala ya se encuentra ${activo ? 'activa' : 'inactiva'}.`);
            }

            ala.activo = activo;

            if (!activo) {
                const habitaciones = await Habitacion.findAll({
                    where: { ala_id: id },
                    attributes: ['id'],
                    transaction: t
                });
                const habitacionIds = habitaciones.map(h => h.id);

                if (habitacionIds.length > 0) {
                    await Cama.update({ activo: false }, { where: { habitacion_id: habitacionIds }, transaction: t });
                }

                await Habitacion.update({ activo: false }, { where: { ala_id: id }, transaction: t });
            }

            await ala.save({ transaction: t });
            return ala;
        });
        return resultado;
    } catch (error) {
        throw error;
    }
}