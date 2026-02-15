const express = require('express');
const router = express.Router();

const admisionController = require('../../controllers/api/admisionApiController');
const { 
  registrarAdmisionValidation,
  setActivoAdmisionValidation,
  setEstadoAdmisionValidation,
  cambiarCamaValidation
 } = require('../../validators/admisionValidator')

// POST /api/admisiones/registrar
router.post('/registrar', registrarAdmisionValidation(), admisionController.registrarAdmision);

// PATCH /api/admisiones/:id/activo
router.patch('/:id/activo', setActivoAdmisionValidation(), admisionController.setActivo);

// PATCH /api/admisiones/:id/estado
router.patch('/:id/estado', setEstadoAdmisionValidation(), admisionController.setEstado);

// POST /api/admisiones/:id/cama
router.post('/:id/cama', cambiarCamaValidation(), admisionController.cambiarCama);

module.exports = router;
