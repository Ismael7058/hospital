const express = require('express');
const router = express.Router();

const medicacionApiController = require('../../controllers/api/medicacionApiController.js');
const {
  registrarMedicacionValidation,
  setActivoValidation,
  setEstadoValidation,
 } = require('../../validators/medicacionValidator');

// POST /api/medicaciones
router.post('/', registrarMedicacionValidation(), medicacionApiController.registrarMedicacion);

// PATCH /api/medicaciones/:id/activo
router.patch('/:id/activo', setActivoValidation(), medicacionApiController.setActivo);

// PATCH /api/medicaciones/:id/estado
router.patch('/:id/activo', setEstadoValidation(), medicacionApiController.setEstado);

module.exports = router;
