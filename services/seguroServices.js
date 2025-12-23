const { SeguroMedico } = require('../db/models');

exports.registerSeguro = async (datosSeguro) => {
    const { nombre } = datosSeguro;

    const seguroExistente = await SeguroMedico.findOne({ where: { nombre } });
    if (seguroExistente) {
        throw new Error('El seguro medico ya existe.');
    }
    
    const nuevoSeguro = await SeguroMedico.create({ nombre, activo: true });
    return nuevoSeguro;
};

exports.editSeguro = async (id, datosActualizados) => {
    const { nombre } = datosActualizados;
    const seguro = await SeguroMedico.findByPk(id);
    if (!seguro) {
        throw new Error('Seguro Medico no encontrado.');
    }

    if (seguro.nombre === nombre) {
        throw new Error('No se han realizado cambios en el seguro medico.');
    }

    const seguroExistente = await SeguroMedico.findOne({ where: { nombre } });
    if (seguroExistente && seguroExistente.id !== parseInt(id)) {
        throw new Error('El nombre del seguro medico ya esta en uso.');
    }

    seguro.nombre = nombre;
    await seguro.save();
    return seguro;
};

exports.setActivo = async (id, activo) => {
    const seguro = await SeguroMedico.findByPk(id);
    if (!seguro) {
        throw new Error('Seguro medico no encontrado.');
    }

    if (seguro.activo === activo) {
        throw new Error(`El seguro medico ya se encuentra ${activo ? 'activa' : 'inactiva'}.`);
    }

    seguro.activo = activo;
    await seguro.save();
    return seguro;
};

exports.getSeguro = async (id) =>{
    const seguro = await SeguroMedico.findByPk(id);
    if (!seguro) {
        throw new Error('Seguro Medico no encontrado');
    }

    return seguro;
}