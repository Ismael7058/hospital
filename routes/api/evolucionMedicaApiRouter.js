const express = require('express');
const router = express.Router();

const evolucionMedicaApiController = require('../../controllers/api/evolucionMedicaApiController.js');
const {
  registrarEvolucionMedicaValidation,
  setActivoValidation,
 } = require('../../validators/evolucionMedicaValidator')


// POST /api/evoluciones-medicas
router.post('/', registrarEvolucionMedicaValidation(), evolucionMedicaApiController.registrarEvolucionMedica);

// PATCH /api/evoluciones-medicas/:id/activo
router.patch('/:id/activo', setActivoValidation(), evolucionMedicaApiController.setActivo);

module.exports = router;
