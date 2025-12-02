const habitacionServices = require('../../services/habitacionServices');
const { validationResult } = require('express-validator');


exports.registerHabitacion = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const newHabitacion = await habitacionServices.registerHabitacion(req.body);

        res.status(201).json({
            message: 'Habitacion registrada correctamente',
            habitacionId: newHabitacion.id
        });

    } catch (error) {
        if(error.message === 'El numero ya está en uso'){
            return res.status(409).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error interno del servidor'});
    }
}

exports.editHabitacion = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { id } = req.params;
        const newHabitacion = await habitacionServices.editHabitacion(id, req.body);

        res.status(200).json({
            message: 'Habitacion modificada correctamente',
            habitacionId: newHabitacion.id
        });
    } catch (error) {
        if (error.message === 'Habitacion no encontrada') {
            return res.status(404).json({ message: error.message });
        }
        if(error.message === 'El numero ya está en uso'){
            return res.status(409).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error interno del servidor'});
    }
}

exports.setActivoHabitacion = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { id } = req.params;
        const { activo } = req.body;

        await habitacionServices.setActivo(id, activo);

        const message = `Habitacion ${activo ? 'dado de alta' : 'dado de baja'} exitosamente.`;
        res.status(200).json({ message });
    } catch (error) {
        switch (error.message) {
            case 'Habitacion no encontrada':
                return res.status(404).json({ message: error.message });
            case 'No se puede desactivar la habitación porque tiene camas ocupadas.':
            case `La habitacion ya se encuentra ${activo ? 'activo' : 'inactivo'}.`:
                return res.status(409).json({ message: error.message });
            default:
                res.status(500).json({ message: error.message || 'Error interno del servidor.' });
        }
    }
};

exports.moverHabitacion = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { id } = req.params;
        const { ala_id } = req.body;

        await habitacionServices.moverHabitacion(id, ala_id);

        res.status(200).json({ message: 'Habitacion trasladada correctamente' });
    } catch (error) {
        switch (error.message) {
            case 'Habitacion no encontrada':
                return res.status(404).json({ message: error.message });
            case 'La habitacion ya se encuentra en la ala':
                return res.status(409).json({ message: error.message });
            default:
                res.status(500).json({ message: error.message || 'Error interno del servidor.' });
        }
    }
}
