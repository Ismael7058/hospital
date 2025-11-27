const { Especialidad, Usuario } = require('../db/models');

exports.registrarEspecialidad = async (datosEspecialidad) => {
    const { nombre } = datosEspecialidad;

    const especialidadExistente = await Especialidad.findOne({ where: { nombre } });
    if (especialidadExistente) {
        throw new Error('La especialidad ya existe.');
    }

    const nuevaEspecialidad = await Especialidad.create({ nombre });
    return nuevaEspecialidad;
};

exports.editEspecialidad = async (id, datosActualizados) => {
    const { nombre } = datosActualizados;
    const especialidad = await Especialidad.findByPk(id);
    if (!especialidad) {
        throw new Error('Especialidad no encontrada.');
    }

    const especialidadExistente = await Especialidad.findOne({ where: { nombre } });
    if (especialidadExistente && especialidadExistente.id !== parseInt(id)) {
        throw new Error('El nombre de la especialidad ya está en uso.');
    }

    especialidad.nombre = nombre;
    await especialidad.save();
    return especialidad;
};

exports.setEstado = async (id, estado) => {
    const especialidad = await Especialidad.findByPk(id);
    if (!especialidad) {
        throw new Error('Especialida no encontrado');
    }

    if (especialidad.activo === estado) {
        throw new Error(`La especialidad ya se encuentra ${estado ? 'activo' : 'inactivo'}.`);
    }

    especialidad.activo = estado;
    await especialidad.save();
    return especialidad;
};