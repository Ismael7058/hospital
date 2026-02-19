const express = require('express');
const router = express.Router();

const { restringirRol } = require('../../middlewares/authMiddleware');

const pacienteApiController = require('../../controllers/api/pacienteApiController');
const { 
    registrarPacienteValidation,
    setActivoPacienteValidation,
    editInformacionPacienteValidation,
    editIdentificacionPacienteValidation
 } = require('../../validators/pacienteValidators');

// POST /api/pacientes/registrar
router.post('/registrar', restringirRol('Recepcionista','Administrador'), registrarPacienteValidation(), pacienteApiController.postRegistrar);

// PATCH /api/pacientes/:id/activo
router.patch('/:id/activo', restringirRol('Recepcionista','Administrador'), setActivoPacienteValidation(), pacienteApiController.setActivo);

// PATCH /api/pacientes/:id/identificacion
router.patch('/:id/identificacion', restringirRol('Recepcionista','Administrador'), editIdentificacionPacienteValidation(), pacienteApiController.editIdentificacion);

// PATCH /api/pacientes/:id
router.patch('/:id', restringirRol('Recepcionista', 'Administrador'), editInformacionPacienteValidation(), pacienteApiController.editInformacion);

// GET /api/pacientes/buscar
router.get('/buscar', restringirRol('Recepcionista','Administrador', 'Medico', 'Enfermero'), pacienteApiController.buscarPacientes);


module.exports = router;
