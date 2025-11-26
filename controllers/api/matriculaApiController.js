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
        if (error.message === 'Usuario no encontrado') {
            return res.status(404).json({ message: error.message });
        }
        // Para cualquier otro error, se devuelve un 500
        console.error('Error al registrar matrícula:', error);
        res.status(500).json({ message: 'Error interno del servidor al registrar la matrícula.' });
    }
};

exports.updateMatricula = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const matriculaId = req.params.id;
        const datosActualizados = req.body;

        const matriculaActualizada = await matriculaServices.actualizarMatricula(matriculaId, datosActualizados);

        if (matriculaActualizada) {
            res.status(200).json({ message: 'Matrícula actualizada exitosamente.' });
        } else {
            res.status(404).json({ message: 'Matrícula no encontrada.' });
        }
    } catch (error) {
        if (error.message === 'Matricula no encontrada') {
            return res.status(404).json({ message: error.message });
        }
        console.error('Error al actualizar matrícula:', error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar la matrícula.' });
    }
};

exports.setEstado = async (req, res) => {
    try {
        const { idMatricula } = req.params;
        const { activo } = req.body;

        if (typeof activo !== 'boolean') {
            return res.status(400).json({ message: 'El estado debe ser un valor booleano (true o false).' });
        }

        await matriculaServices.setEstado(idMatricula, activo);

        const message = `Matricula ${activo ? 'dado de alta' : 'dado de baja'} exitosamente.`;
        res.status(200).json({ message });
    } catch (error) {
        console.error('Error al cambiar el estado de la matricula:', error);
        res.status(500).json({ message: error.message || 'Error interno del servidor.' });
    }
};
