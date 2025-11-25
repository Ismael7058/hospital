const { Matricula, Usuario } = require('../db/models');
const matricula = require('../db/models/matricula');

exports.registerMatricula = async (matriculaData) => {
    const { usurio_id } = matriculaData;

    const usuario = await Usuario.findByPk(usurio_id);

    if (!usuario){
        throw new Error('Usuario no encontrado');        
    }

    try {
        const matricula = await Matricula.create(matriculaData);
        return matricula;
    } catch (error) {
        return error;
    }
}

exports.actualizarMatricula = async (id, datosActualizados) => {
    const matricula = await Matricula.findByPk(id);
    if(!matricula){
        throw new Error('Matricula no encontrada');
    };

    const atributosEditables = {
        fecha_vencimiento: datosActualizados.fecha_vencimiento
    };

    const [filasActualizadas] = await Matricula.update (atributosEditables, {
        where: { id:id }
    });

    return filasActualizadas;
}

exports.setEstado = async (id, estado) =>{
    const matricula = await Matricula.findByPk(id);
    if(!matricula){
        throw new Error('Matricula no encontrada');
    }

    if(matricula.activo === estado){
        throw new Error(`La meticula ya se encuentra ${estado ? 'activo' : 'inactivo'}.`);
    }

    matricula.activo = estado;
    await matricula.save();
    return matricula;
}
