const agendaServices = require('../../services/agendaServices');
const { validationResult } = require('express-validator');

exports.registrarAgenda = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const nuevaAgenda = await agendaServices.registrarAgenda(req.body);

        res.status(201).json({
            message: 'Agenda registrada correctamente',
            agendaId: nuevaAgenda.id
        });
    } catch (error) {
        if (error.message === 'El rango de fechas se superpone con una agenda existente.') {
            return res.status(409).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error interno del servidor al registrar la Agenda'});
    }
}

exports.setActivo = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    const { activo } = req.body;

    try {
        const { id } = req.params;

        await agendaServices.setActivo(id, activo);

        const message = `Agenda ${activo ? 'dado de alta' : 'dado de baja'} exitosamente.`;
        res.status(200).json({ message });
    } catch (error) {
        switch (error.message) {
            case 'Agenda no encontrada':
                return res.status(404).json({ message: error.message });
            case `La agenda ya se encuentra ${activo ? 'activo' : 'inactivo'}.`:
                return res.status(409).json({ message: error.message });
            case 'El rango de fechas se superpone con una agenda existente.':
                return res.status(409).json({ message: error.message });
            default:
                res.status(500).json({ message: 'Error interno del servidor.' });
        }

    }
}

exports.editAgenda = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { id } = req.params;

        await agendaServices.editAgenda(id, req.body);

        res.status(200).json({ message: "Agenda modificada correctamente" });
    } catch (error) {
        switch (error.message) {
            case 'Agenda no encontrada':
                return res.status(404).json({ message: error.message });
            case 'El rango de fechas se superpone con una agenda existente.':
                return res.status(409).json({ message: error.message });
            default:
                res.status(500).json({ message: error.message || 'Error interno del servidor' });
        }
    }
}