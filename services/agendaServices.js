const { Agenda, Usuario } = require('../db/models');
const { Op } = require('sequelize');

exports.registrarAgenda = async (datosAgenda) => {

    const { usuario_id, fecha_inicio, fecha_fin, motivo } = datosAgenda;

    const agendaExistente = await Agenda.findOne({
        where: {
            usuario_id,
            activo: true,
            [Op.and]: [
                { fecha_inicio: { [Op.lte]: fecha_fin } },
                { fecha_fin: { [Op.gte]: fecha_inicio } }
            ]
        }
    });

    if (agendaExistente) {
        throw new Error('El rango de fechas se superpone con una agenda existente.');
    }

    const newAgenda = await Agenda.create({
        fecha_inicio,
        fecha_fin,
        motivo: motivo || null,
        activo: true,
        usuario_id
    });

    return newAgenda;
};

exports.setActivo = async (id, activo) => {
    const agenda = await Agenda.findByPk(id);
    if (!agenda) {
        throw new Error('Agenda no encontrada');
    }

    if (agenda.activo === activo) {
        throw new Error(`La agenda ya se encuentra ${activo ? 'activo' : 'inactivo'}.`);
    }

    if (activo) {
        const agendaExistente = await Agenda.findOne({
            where: {
                usuario_id: agenda.usuario_id,
                activo: true,
                id: { [Op.ne]: id },
                [Op.and]: [
                    { fecha_inicio: { [Op.lte]: agenda.fecha_fin } },
                    { fecha_fin: { [Op.gte]: agenda.fecha_inicio } }
                ]
            }
        });

        if (agendaExistente) {
            throw new Error('El rango de fechas se superpone con una agenda existente.');
        }
    }

    agenda.activo = activo;
    await agenda.save();
    return agenda;
}

exports.editAgenda = async (id, datosModificados) => {
    const { fecha_inicio, fecha_fin, motivo } = datosModificados;
    const agenda = await Agenda.findByPk(id);
    if (!agenda) {
        throw new Error('Agenda no encontrada');
    }

    const agendaExistente = await Agenda.findOne({
        where: {
            usuario_id: agenda.usuario_id,
            activo: true,
            id: { [Op.ne]: id },
            [Op.and]: [
                { fecha_inicio: { [Op.lte]: fecha_fin } },
                { fecha_fin: { [Op.gte]: fecha_inicio } }
            ]
        }
    });

    if (agendaExistente) {
        throw new Error('El rango de fechas se superpone con una agenda existente.');
    }

    await agenda.update({
        fecha_inicio, 
        fecha_fin, 
        motivo: motivo || null
    });

    return agenda;
}