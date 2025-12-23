const express = require('express');
const router = express.Router();
const pacienteSeguroController = require('../../controllers/api/pacienteSeguroApiController');
const { 
    registrarPacienteSeguroValidation,
    renovarPacienteSeguroValidation,
    setActivoPacienteSeguroValidation
} = require('../../validators/pacienteSeguroValidators');

// POST /api/paciente-seguros/register
router.post('/register', registrarPacienteSeguroValidation(), pacienteSeguroController.registrarPacienteSeguro);

// PATCH /api/paciente-seguros/:id
router.patch('/:id', renovarPacienteSeguroValidation(), pacienteSeguroController.renovarPacienteSeguro);

// PATCH /api/paciente-seguros/:id/activo
router.patch('/:id/activo', setActivoPacienteSeguroValidation(), pacienteSeguroController.setActivo);

module.exports = router;
