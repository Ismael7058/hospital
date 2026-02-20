const express = require('express');
const router = express.Router();

const { restringirRol } = require('../../middlewares/authMiddleware');

const pacienteSeguroController = require('../../controllers/api/pacienteSeguroApiController');
const { 
    registrarPacienteSeguroValidation,
    renovarPacienteSeguroValidation,
    setActivoPacienteSeguroValidation
} = require('../../validators/pacienteSeguroValidators');

// POST /api/paciente-seguros/register
router.post('/register', restringirRol('Administrador', 'Recepcion'), registrarPacienteSeguroValidation(), pacienteSeguroController.registrarPacienteSeguro);

// PATCH /api/paciente-seguros/:id
router.patch('/:id', restringirRol('Administrador', 'Recepcion'), renovarPacienteSeguroValidation(), pacienteSeguroController.renovarPacienteSeguro);

// PATCH /api/paciente-seguros/:id/activo
router.patch('/:id/activo', restringirRol('Administrador'), setActivoPacienteSeguroValidation(), pacienteSeguroController.setActivo);

module.exports = router;
