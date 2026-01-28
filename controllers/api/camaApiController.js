const camaServices = require('../../services/camaServices');
const { validationResult } = require('express-validator');

exports.registerCama = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const newCama = await camaServices.registerCama(req.body);

        res.status(201).json({
            message: 'Cama registrada correctamente',
            habitacionId: newCama.id
        });

    } catch (error) {
        if (error.message === 'La habitación especificada no existe.' || error.message === 'La habitación ya ha alcanzado su capacidad máxima de camas.') {
            return res.status(404).json({ message: error.message });
        }
        if(error.message === 'El codigo ya está en uso'){
            return res.status(409).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error interno del servidor'});
    }
}

exports.editCama = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { id } = req.params;
        const newCama = await camaServices.editCama(id, req.body);

        res.status(200).json({
            message: 'Cama modificada correctamente',
            habitacionId: newCama.id
        });
    } catch (error) {
        if (error.message === 'Cama no encontrada') {
            return res.status(404).json({ message: error.message });
        }
        if(error.message === 'El codigo ya está en uso'){
            return res.status(409).json({ message: error.message });
        }
        res.status(500).json({ message: 'Error interno del servidor'});
    }
}

exports.setActivoCama = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { id } = req.params;
        const { activo } = req.body;

        await camaServices.setActivo(id, activo);

        const message = `Cama ${activo ? 'dado de alta' : 'dado de baja'} exitosamente.`;
        res.status(200).json({ message });
    } catch (error) {
        switch (error.message) {
            case 'Cama no encontrada':
            case 'La habitación asociada a esta cama no existe.':
                return res.status(404).json({ message: error.message });
            case 'La cama ya se encuentra en ese estado':
            case 'No se puede desactivar una cama que no esta libre.':
            case 'No se puede activar la cama. La habitación ya ha alcanzado su capacidad máxima de camas.':
                return res.status(409).json({ message: error.message });
            default:
                res.status(500).json({ message: error.message || 'Error interno del servidor.' });
        }
    }
};

exports.moverCama = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { id } = req.params;
        const { habitacion_id } = req.body;

        await camaServices.moverCama(id, habitacion_id);

        res.status(200).json({ message: 'Cama trasladada correctamente' });
    } catch (error) {
        switch (error.message) {
            case 'Cama no encontrada':
            case 'La habitación de destino no existe.':
                return res.status(404).json({ message: error.message });
            case 'La cama ya se encuentra en esta habitación.':
            case 'La habitación de destino ya ha alcanzado su capacidad máxima de camas.':
                return res.status(409).json({ message: error.message });
            default:
                res.status(500).json({ message: error.message || 'Error interno del servidor' });
        }
    }
}

exports.setEstadoCama = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { id } = req.params;
        const { usuario_id, estado } = req.body;

        await camaServices.setEstado(id, usuario_id, estado);

        res.status(200).json({ message: 'Cama actualizada correctamente' });
    } catch (error) {
        switch (error.message) {
            case 'Cama no encontrada':
                return res.status(404).json({ message: error.message });
            case 'La cama ya se encuentra en ese estado.':
                return res.status(409).json({ message: error.message });
            default:
                res.status(500).json({ message: error.message || 'Error interno del servidor' });
        }
    }
}

exports.getCama = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { id } = req.params;
        const cama = await camaServices.getCama(id);
        res.status(200).json(cama);
    } catch (error) {
        switch (error.message) {
            case 'Cama no encontrada':
                return res.status(404).json({ message: error.message });
            default:
                res.status(500).json({ message: error.message || 'Error interno del servidor.' });
        }
    }
}

exports.getCamas = async (req, res) => {
  try {
      const { habitacion_id, estado } = req.query;
      const camas = await camaServices.getCamas(habitacion_id, estado);

      res.status(200).json(camas);
  } catch (error) {
      res.status(500).json({ message: 'Error interno del servidor al obtener las camas' });
  }
};