const express = require('express');
const router = express.Router();

const cuidadoApiController = require('../../controllers/api/cuidadoApiController.js');
const {
  registrarCuidadoValidation,
  setActivoValidation,
 } = require('../../validators/cuidadoValidator.js')


// POST /api/cuidados-preeliminares
router.post('/', registrarCuidadoValidation(), cuidadoApiController.registrarCuidado);

// PATCH /api/cuidados-preeliminares/:id/activo
router.patch('/:id/activo', setActivoValidation(), cuidadoApiController.setActivo);

module.exports = router;
