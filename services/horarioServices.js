const { Horario, Usuario } = require('../db/models');
const { Op } = require('sequelize');


exports.registrarHorario = async (horarioData) => {
    const { usuario_id, fecha, hora_inicio, hora_fin } = horarioData;
    const usuario = await Usuario.findByPk(usuario_id);

    if (!usuario) {
        throw new Error('Usuario no encontrado');
    }

    const horarioExistente = await Horario.findOne({
        where: {
            usuario_id: usuario_id,
            fecha: fecha,
            activo: true
        }
    });

    if (horarioExistente) {
        throw new Error('El horario se superpone con un horario vigente');
    }

    const datosParaCrear = {
        usuario_id,
        fecha,
        hora_inicio,
        hora_fin,
        activo: true
    }

    const horario = await Horario.create(datosParaCrear);
    return horario;
}

exports.editHorario = async (id, datosModificados) => {
    const horario = await Horario.findByPk(id);

    if (!horario) {
        throw new Error('Horario no encontrado');
    }

    const atriburosEditables = {
        fecha: datosModificados.fecha,
        hora_inicio: datosModificados.hora_inicio,
        hora_fin: datosModificados.hora_fin
    }

    if (horario.activo){
        const horarioExistente = await Horario.findOne({
            where: {
                usuario_id: horario.usuario_id,
                fecha: datosModificados.fecha,
                activo: true,
                id: { [Op.ne]: id }
            }
        });
    
        if (horarioExistente) {
            throw new Error('El horario se superpone con un horario vigente');
        }
    }

    await horario.update(atriburosEditables);
}

exports.setActivoHorario = async (id, activo) => {
    const horario = await Horario.findByPk(id);

    if (!horario) {
        throw new Error('Horario no encontrado');
    }

    if (horario.activo === activo) {
        throw new Error(`El horario ya se encuentra ${activo ? 'activo' : 'inactivo'}.`);
    }

    if (activo){
        const horarioExistente = await Horario.findOne({
            where: {
                usuario_id: horario.usuario_id,
                fecha: horario.fecha,
                activo: true
            }
        });
    
        if (horarioExistente) {
            throw new Error('El horario se superpone con un horario vigente');
        }
    }

    horario.activo = activo;
    await horario.save();
    return horario;
}

exports.eliminarHorario = async (id) => {
    const horario = await Horario.findByPk(id);

    if (!horario) {
        throw new Error('Horario no encontrado');
    }

    await horario.destroy();
    return horario;
}

exports.getHorario = async(id) => {
    const horario = await Horario.findByPk(id);

    if (!horario) {
        throw new Error('Horario no encontrado');
    }
    return horario
}