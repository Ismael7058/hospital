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
router.post('/registrar', restringirRol('Administrador', 'Recepcion'), registrarPacienteValidation(), pacienteApiController.postRegistrar);

// PATCH /api/pacientes/:id/activo
router.patch('/:id/activo', restringirRol('Administrador'), setActivoPacienteValidation(), pacienteApiController.setActivo);

// PATCH /api/pacientes/:id/identificacion
router.patch('/:id/identificacion', restringirRol('Administrador', 'Recepcion'), editIdentificacionPacienteValidation(), pacienteApiController.editIdentificacion);

// PATCH /api/pacientes/:id
router.patch('/:id', restringirRol('Recepcion', 'Administrador'), editInformacionPacienteValidation(), pacienteApiController.editInformacion);

// GET /api/pacientes/buscar
router.get('/buscar', restringirRol('Recepcion','Administrador', 'Medico', 'Enfermero'), pacienteApiController.buscarPacientes);

// GET /api/pacientes/disponibles
router.get('/disponibles', restringirRol('Recepcion','Administrador', 'Medico', 'Enfermero'), pacienteApiController.pacientesDisponibles);


module.exports = router;
