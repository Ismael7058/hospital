const seguroServices = require('../../services/seguroServices');
const { validationResult } = require('express-validator');

exports.getSeguro = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const seguro = await seguroServices.getSeguro(req.params.id);
        res.status(200).json(seguro);

    } catch (error) {
        switch (error.message) {
            case 'Seguro Medico no encontrado':
                return res.status(404).json({ message: error.message });
            default:
                res.status(500).json({ message: 'Error interno del servidor'});
        }
    }
}

exports.registerSeguro = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const nuevoSeguro = await seguroServices.registerSeguro(req.body);

        res.status(201).json({
            message: 'Seguro medico registrado correctamente',
            seguroId: nuevoSeguro.id
        });

    } catch (error) {
        switch (error.message) {
            case 'El seguro medico ya existe.':
                return res.status(409).json({ message: error.message });
            default:
                res.status(500).json({ message: 'Error interno del servidor'});
        }
    }
}

exports.editSeguro = async (req, res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const seguroId = req.params.id;
        const datosParaActualizar = req.body;

        await seguroServices.editSeguro(seguroId, datosParaActualizar);

        res.status(200).json({ message: 'Seguro Medico editado correctamente' });
    } catch (error) {
        switch (error.message) {
            case 'Seguro Medico no encontrado.':
                return res.status(404).json({ message: error.message });
            case 'No se han realizado cambios en el seguro medico.':
                return res.status(400).json({ message: error.message });
            case 'El nombre del seguro medico ya esta en uso.':
            case 'El nombre del seguro medico ya está en uso.':
                return res.status(409).json({ message: error.message });
            default:
                res.status(500).json({ message: 'Error interno del servidor'});
        }
    }
};

exports.setActivo = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    const { activo } = req.body;

    try {
        const seguroId = req.params.id;

        await seguroServices.setActivo(seguroId, activo);

        const message = `Seguro Medico ${activo ? 'dada de alta' : 'dada de baja'} exitosamente.`;
        res.status(200).json({ message });
    } catch (error) {
        switch (error.message) {
            case 'Seguro medico no encontrado.':
                return res.status(404).json({ message: error.message });
            case `El seguro medico ya se encuentra ${activo ? 'activa' : 'inactiva'}.`:
                return res.status(400).json({ message: error.message });
            default:
                res.status(500).json({ message: error.message || 'Error interno del servidor.' });
        }
    }
};