const { Matricula, Usuario } = require('../db/models');

exports.registerMatricula = async (matriculaData) => {
    const { usuario_id } = matriculaData;
    const usuario = await Usuario.findByPk(usuario_id);

    if (!usuario) {
        throw new Error('Usuario no encontrado');
    }

    const matriculaPrincipalExistente = await Matricula.findOne({
        where: {
            usuario_id: usuario_id,
            es_principal: true,
            activo: true
        }
    });

    const datosParaCrear = {
        ...matriculaData,
        activo: true,
        es_principal: !matriculaPrincipalExistente
    };

    try {
        const matricula = await Matricula.create(datosParaCrear);
        return matricula;
    } catch (error) {
        throw error
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
