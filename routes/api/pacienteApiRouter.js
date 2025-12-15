const express = require('express');
const router = express.Router();

const pacienteApiController = require('../../controllers/api/pacienteApiController');
const { registrarPacienteValidation } = require('../../validators/pacienteValidators');

// POST /api/pacientes/registrar
router.post('/registrar', registrarPacienteValidation(), pacienteApiController.postRegistrar);

module.exports = router;
