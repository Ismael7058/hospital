const especialidad = require('../../db/models/especialidad');
const usuario = require('../../db/models/usuario');
const especialidadServices = require('../../services/especialidadServices');
const { validationResult } = require('express-validator');

exports.getEspecialidad = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const especialidad = await especialidadServices.getEspecialidad(req.params.id);
        res.status(200).json(especialidad);

    } catch (error) {
        if (error.message === 'Especialidad no encontrada') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error interno del servidor'});
    }
}

exports.registerEspecialidad = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const nuevaEspecialidad = await especialidadServices.registrarEspecialidad(req.body);

        res.status(201).json({
            message: 'Especialidad registrada correctamente',
            especialidadId: nuevaEspecialidad.id
        });

    } catch (error) {
        if(error.message === 'La especialidad ya existe.'){
            return res.status(409).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error interno del servidor'});
    }
}

exports.editEspecialidad = async (req, res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const especialidadId = req.params.id;
        const datosParaActualizar = req.body;

        await especialidadServices.editEspecialidad(especialidadId, datosParaActualizar);

        res.status(200).json({ message: 'Especialidad editada correctamente' });
    } catch (error) {
        if(error.message === 'Especialidad no encontrada.'){
            return res.status(404).json({ message: error.message });
        }
        if(error.message === 'No se han realizado cambios en la especialidad.'){
            return res.status(400).json({ message: error.message });
        }
        if(error.message === 'La especialidad ya existe.'){
            return res.status(409).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error interno del servidor'});
    }
};

exports.setEstado = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const especialidadId = req.params.id;
        const { activo } = req.body;

        await especialidadServices.setEstado(especialidadId, activo);

        const message = `Especialidad ${activo ? 'dada de alta' : 'dada de baja'} exitosamente.`;
        res.status(200).json({ message });
    } catch (error) {
        res.status(500).json({ message: error.message || 'Error interno del servidor.' });
    }
};