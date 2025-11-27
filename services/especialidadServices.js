const { Especialidad, Usuario } = require('../db/models');

exports.registrarEspecialidad = async (datosEspecialidad) => {
    const { nombre } = datosEspecialidad;

    const especialidadExistente = await Especialidad.findOne({ where: { nombre } });
    if (especialidadExistente) {
        throw new Error('La especialidad ya existe.');
    }
    
    const nuevaEspecialidad = await Especialidad.create({ nombre, activo: true });
    return nuevaEspecialidad;
};

exports.editEspecialidad = async (id, datosActualizados) => {
    const { nombre } = datosActualizados;
    const especialidad = await Especialidad.findByPk(id);
    if (!especialidad) {
        throw new Error('Especialidad no encontrada.');
    }

    // Comprobar si el nombre que se quiere guardar es diferente al actual.
    if (especialidad.nombre === nombre) {
        throw new Error('No se han realizado cambios en la especialidad.');
    }

    const especialidadExistente = await Especialidad.findOne({ where: { nombre } });
    if (especialidadExistente && especialidadExistente.id !== parseInt(id)) {
        throw new Error('El nombre de la especialidad ya está en uso.');
    }

    especialidad.nombre = nombre;
    await especialidad.save();
    return especialidad;
};

exports.setEstado = async (id, activo) => {
    const especialidad = await Especialidad.findByPk(id);
    if (!especialidad) {
        throw new Error('Especialida no encontrado');
    }

    if (especialidad.activo === activo) {
        throw new Error(`La especialidad ya se encuentra ${activo ? 'activa' : 'inactiva'}.`);
    }

    especialidad.activo = activo;
    await especialidad.save();
    return especialidad;
};

exports.getEspecialidad = async (id) =>{
    const especialidad = await Especialidad.findByPk(id);
    if (!especialidad) {
        throw new Error('Especialidad no encontrada');
    }

    return especialidad;
}