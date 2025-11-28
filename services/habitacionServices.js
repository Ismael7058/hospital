const { Habitacion, Cama, sequelize } = require('../db/models');

exports.registerHabitacion = async (habitacionData) => {
    const habitacion = await Habitacion.findOne({ where: { nombre } });
    if (habitacion) {
        throw new Error('El nombre ya está en uso');
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
    const habitacion = await Habitacion.findByPk(id);
    if (!habitacion) {
        throw new Error('Habitacion no encontrada');
    }

    const atributosEditables = {
        numero: datosActualizados.numero,
        capacidad: datosActualizados.capacidad,
        descripcion: datosActualizados.descripcion
    }

    const [filasActualizadas] = await Habitacion.update(atributosEditables, { where: { id: id } });
    
    return filasActualizadas;
}

exports.setEstado = async (id, activo) => {
    try {
        const resultado = await sequelize.transaction(async (t) => {
            const habitacion = await Habitacion.findByPk(id, { transaction: t });
            if (!habitacion) {
                throw new Error('Habitacion no encontrada');
            }

            if (habitacion.activo === activo) {
                throw new Error(`La habitacion ya se encuentra ${activo ? 'activo' : 'inactivo'}.`);
            }

            habitacion.activo = activo;

            if (!activo) {
                await Cama.update({ activo: false }, { where: { habitacion_id: id }, transaction: t });
            }

            await habitacion.save({ transaction: t });
            return habitacion;
        });
        return resultado;
    } catch (error) {
        throw error;
    }
}