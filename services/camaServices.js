const { Cama } = require('../db/models');

exports.registerCama = async (camaData) => {
    const datosParaCrear = {
        ...camaData,
        activo: true
    }

    try {
        const newCama = await Cama.create(datosParaCrear);
        return newCama;
    } catch (error) {
        throw error;
    }
}

exports.editCama = async(id, datosActualizados) => {
    const cama = await Cama.findByPk(id);
    if (!cama) {
        throw new Error('Cama no encontrada');
    }

    const { codigo } = datosActualizados;

    ala.codigo = codigo;
    await ala.save();
    return ala;
}

exports.setEstado = async (id, activo) => {
    const cama = await Cama.findByPk(id);
    if (!cama) {
        throw new Error('Cama no encontrada');
    }

    if (cama.activo === activo) {
        throw new Error(`La cama ya se encuentra ${activo ? 'activa' : 'inactiva'}.`);
    }

    cama.activo = activo;
    await cama.save();
    return cama;
}