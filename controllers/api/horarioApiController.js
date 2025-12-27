const horarioServices = require('../../services/horarioServices');
const { validationResult } = require('express-validator');

exports.registrarHorario = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const nuevoHorario = await horarioServices.registrarHorario(req.body);
        res.status(201).json({
            message: 'Horario registrado exitosamente.',
            horario: nuevoHorario
        });
    } catch (error) {
        switch (error.message) {
            case 'Usuario no encontrado':
                return res.status(404).json({ message: error.message });
            case 'El horario se superpone con un horario vigente':
                return res.status(409).json({ message: error.message });
            default:
                res.status(500).json({ message: error.message || 'Error interno del servidor al registrar el horario' });
        }
    }
}

exports.editHorario = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { id } = req.params;
        await horarioServices.editHorario(id, req.body);
        res.status(200).json({
            message: 'Horario modificado exitosamente.'
        });
    } catch (error) {
        switch (error.message) {
            case 'Horario no encontrado':
                return res.status(404).json({ message: error.message });
            case 'El horario se superpone con un horario vigente':
                return res.status(409).json({ message: error.message });
            default:
                res.status(500).json({ message: 'Error interno del servidor al registrar el horario' });
        }
    }
}

exports.setActivoHorario = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { activo } = req.body;
    try {
        const { id } = req.params;
        await horarioServices.setActivoHorario(id, activo);

        res.status(200).json({ message: `Horario ${activo ? 'activado' : 'desactivado'} exitosamente.` });
    } catch (error) {
        switch (error.message) {
            case 'Horario no encontrado':
                return res.status(404).json({ message: error.message });
            case `El horario ya se encuentra ${activo ? 'activo' : 'inactivo'}.`:
            case 'El horario se superpone con un horario vigente':
                return res.status(400).json({ message: error.message });
            default:
                res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }
};

exports.eliminarHorario = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { id } = req.params;
        await horarioServices.eliminarHorario(id);
        res.status(200).json({ message: 'Horario eliminado correctamente.' });
    } catch (error) {
        switch (error.message) {
            case 'Horario no encontrado':
                return res.status(404).json({ message: error.message });
            default:
                res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }
};

exports.getHorario = async (req, res) => {
    try {
        const { id } = req.params;
        const horario = await horarioServices.getHorario(id);
        res.status(200).json({ horario });
    } catch (error) {
        switch (error.message) {
            case 'Horario no encontrado':
                return res.status(404).json({ message: error.message });
            default:
                res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }
}