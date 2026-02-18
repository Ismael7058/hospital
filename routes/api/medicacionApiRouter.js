const express = require('express');
const router = express.Router();

const medicacionApiController = require('../../controllers/api/medicacionApiController.js');
const {
  registrarMedicacionValidation,
  setActivoValidation,
 } = require('../../validators/medicacionValidator');

// POST /api/medicaciones
router.post('/', registrarMedicacionValidation(), medicacionApiController.registrarMedicacion);

// PATCH /api/medicaciones/:id/activo
router.patch('/:id/activo', setActivoValidation(), medicacionApiController.setActivo);

module.exports = router;
