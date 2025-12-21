const express = require('express');
const router = express.Router();

const pacienteApiController = require('../../controllers/api/pacienteApiController');
const { 
    registrarPacienteValidation,
    setActivoPacienteValidation,
    editInformacionPacienteValidation,
    editIdentificacionPacienteValidation
 } = require('../../validators/pacienteValidators');

// POST /api/pacientes/registrar
router.post('/registrar', registrarPacienteValidation(), pacienteApiController.postRegistrar);

// PATCH /api/pacientes/:id/activo
router.patch('/:id/activo', setActivoPacienteValidation(), pacienteApiController.setActivo);

// PATCH /api/pacientes/:id/identificacion
router.patch('/:id/identificacion', editIdentificacionPacienteValidation(), pacienteApiController.editIdentificacion);

// PATCH /api/pacientes/:id
router.patch('/:id', editInformacionPacienteValidation(), pacienteApiController.editInformacion);



module.exports = router;
