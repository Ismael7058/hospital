const alaServices = require('../../services/alaServices');
const { validationResult } = require('express-validator');


exports.registerAla = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const newAla = await alaServices.registerAla(req.body);

        res.status(201).json({
            message: 'Ala registrada correctamente',
            alaId: newAla.id
        });

    } catch (error) {
        if(error.message === 'El nombre ya está en uso'){
            return res.status(409).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error interno del servidor'});
    }
}

exports.editAla = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { id } = req.params;
        const newAla = await alaServices.editAla(id, req.body);

        res.status(200).json({
            message: 'Ala modificada correctamente',
            alaId: newAla.id
        });
    } catch (error) {
        if (error.message === 'Ala no encontrada') {
            return res.status(404).json({ message: error.message });
        }
        if(error.message === 'El nombre ya está en uso'){
            return res.status(409).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error interno del servidor'});
    }
}

exports.setActivoAla = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    const { activo } = req.body;
    try {
        const { id } = req.params;
        
        await alaServices.setActivo(id, activo);

        const message = `Ala ${activo ? 'dado de alta' : 'dado de baja'} exitosamente.`;
        res.status(200).json({ message });
    } catch (error) {
        switch (error.message) {
            case 'Ala no encontrada':
                return res.status(404).json({ message: error.message });
            case 'No se puede desactivar el ala porque tiene camas ocupadas.':
            case `El ala ya se encuentra ${activo ? 'activa' : 'inactiva'}.`:
                return res.status(409).json({ message: error.message });
            default:
                res.status(500).json({ message: error.message || 'Error interno del servidor.' });
        }
    }
};

exports.getAlas = async (req, res) => {
    try {
        const { nombre } = req.query;
        const alas = await alaServices.getAlas(nombre || '');

        res.status(200).json(alas);
    } catch (error) {
        res.status(500).json({ message: error || 'Error interno del servidor.' });
    }
}
