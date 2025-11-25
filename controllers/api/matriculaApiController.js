const matriculaServices = require('../../services/matriculaServices');
const { validationResult } = require('express-validator');

exports.registerMatricula = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const nuevaMatricula = await matriculaServices.registerMatricula(req.body);
        res.status(201).json({
            message: 'Matrícula registrada exitosamente.',
            matricula: nuevaMatricula
        });
    } catch (error) {
        // Manejo de errores específico para matrículas
        console.error('Error al registrar matrícula:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

exports.updateMatricula = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const matriculaId = req.params.idMatricula;
        const datosActualizados = req.body;

        const matriculaActualizada = await matriculaServices.updateMatricula(matriculaId, datosActualizados);

        if (matriculaActualizada) {
            res.status(200).json({ message: 'Matrícula actualizada exitosamente.' });
        } else {
            res.status(404).json({ message: 'Matrícula no encontrada.' });
        }
    } catch (error) {
        console.error('Error al actualizar matrícula:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

