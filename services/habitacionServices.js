const { Habitacion, Cama, sequelize } = require('../db/models');

exports.registerHabitacion = async (habitacionData) => {
    const habitacion = await Habitacion.findOne({ where: { numero: habitacionData.numero } });
    if (habitacion) {
        throw new Error('El numero ya está en uso');
    }

    const datosParaCrear = {
        ...habitacionData,
        activo: true
    }

    try {
        const newHabitacion = await Habitacion.create(datosParaCrear);
        return newHabitacion;
    } catch (error) {
        throw error;
    }
}

exports.editHabitacion = async (id, datosActualizados) => {
    try {
        const habitacion = await Habitacion.findByPk(id);
        if (!habitacion) {
            throw new Error('Habitacion no encontrada');
        }

        const numeroUsado = await Habitacion.findOne({ where: { numero: datosActualizados.numero } });
        if (numeroUsado && numeroUsado.id !== id) {
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
                        ocupada: true
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