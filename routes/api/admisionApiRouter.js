const express = require('express');
const router = express.Router();

const admisionController = require('../../controllers/api/admisionApiController');
const { 
  registrarAdmisionValidation,
  setActivoAdmisionValidation
 } = require('../../validators/admisionValidator')

// POST /api/admisiones/registrar
router.post('/registrar', registrarAdmisionValidation(), admisionController.registrarAdmision);

// PATCH /api/turnos/:id/activo
router.patch('/:id/activo', setActivoAdmisionValidation(), admisionController.setActivo);


module.exports = router;
