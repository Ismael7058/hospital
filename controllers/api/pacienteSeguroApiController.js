const pacienteSeguroServices = require('../../services/pacienteSeguroServices');
const { validationResult } = require('express-validator');

exports.registrarPacienteSeguro = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const pacienteSeguroNuevo = await pacienteSeguroServices.registrarPacienteSeguro(req.body)

        res.status(201).json({ message: 'Seguro asignado correctamente', id: pacienteSeguroNuevo.id });
    } catch (error) {
        switch (error.message) {
            case 'El paciente ya tiene este seguro médico activo.':
                return res.status(409).json({ message: error.message });
            default:
                res.status(500).json({ message: error.message || 'Error interno del servidor.' });
        }
    }
};

exports.renovarPacienteSeguro = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { id } = req.params;

        await pacienteSeguroServices.renovarPacienteSeguro(id, req.body)

        res.status(200).json({ message: 'Seguro actualizado correctamente' });
    } catch (error) {
        switch (error.message) {
            case 'Seguro del paciente no encontrado':
                return res.status(404).json({ message: error.message });
            case 'Paciente no disponible, no puede modificar sus seguros medicos':
            case 'La fecha de expiracion debe ser mayor a la fecha de vigencia':
                return res.status(404).json({ message: error.message });
            default:
                res.status(500).json({ message: error.message || 'Error interno del servidor.' });
        }
    }
};

exports.setActivo = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { activo } = req.body;

    try {
        const { id } = req.params;

        await  pacienteSeguroServices.setActivo(id, activo);

        res.status(200).json({ message: `Seguro ${activo ? 'activado' : 'desactivado'} correctamente` });
    } catch (error) {
        switch (error.message) {
            case 'Seguro del paciente no encontrado':
                return res.status(404).json({ message: error.message });
            case `La especialidad ya se encuentra ${activo ? 'activa' : 'inactiva'}.`:
                return res.status(409).json({ message: error.message });
            default:
                res.status(500).json({ message: error.message || 'Error interno del servidor.' });
        }
    }
};
