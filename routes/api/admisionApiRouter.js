const express = require('express');
const router = express.Router();

const admisionController = require('../../controllers/api/admisionApiController');
const { 
  registrarAdmisionValidation,
  setActivoAdmisionValidation,
  setEstadoAdmisionValidation
 } = require('../../validators/admisionValidator')

// POST /api/admisiones/registrar
router.post('/registrar', registrarAdmisionValidation(), admisionController.registrarAdmision);

// PATCH /api/admisiones/:id/activo
router.patch('/:id/activo', setActivoAdmisionValidation(), admisionController.setActivo);

// PATCH /api/admisiones/:id/estado
router.patch('/:id/estado', setEstadoAdmisionValidation(), admisionController.setEstado);

module.exports = router;
