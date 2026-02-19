const express = require('express');
const router = express.Router();

const { restringirRol } = require('../../middlewares/authMiddleware');

const admisionController = require('../../controllers/api/admisionApiController');
const { 
  registrarAdmisionValidation,
  setActivoAdmisionValidation,
  setEstadoAdmisionValidation,
  cambiarCamaValidation,
  atenderAdmisionValidation,
  cambiarPacienteValidation,
 } = require('../../validators/admisionValidator')

// POST /api/admisiones/registrar
router.post('/registrar', restringirRol('Recepcionista','Administrador'),  registrarAdmisionValidation(), admisionController.registrarAdmision);

// PATCH /api/admisiones/:id/activo
router.patch('/:id/activo', restringirRol('Administrador'), setActivoAdmisionValidation(), admisionController.setActivo);

// PATCH /api/admisiones/:id/estado
router.patch('/:id/estado', restringirRol('Medico', 'Administrador'), setEstadoAdmisionValidation(), admisionController.setEstado);

// POST /api/admisiones/:id/cama
router.post('/:id/cama', restringirRol('Medico', 'Recepcionista' , 'Administrador'), cambiarCamaValidation(), admisionController.cambiarCama);

// POST /api/admisiones/:id/atender
router.post('/:id/atender', restringirRol('Medico'), atenderAdmisionValidation(), admisionController.atenderAdmision);

// PATCH /api/admisiones/:id/cambiar-paciente
router.patch('/:id/cambiar-paciente', restringirRol('Medico', 'Administrador'), cambiarPacienteValidation(), admisionController.cambiarPaciente)

module.exports = router;
