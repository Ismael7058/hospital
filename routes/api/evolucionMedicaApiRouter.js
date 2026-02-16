const express = require('express');
const router = express.Router();

const evolucionMedicaApiController = require('../../controllers/api/evolucionMedicaApiController.js');
const {
  registrarEvolucionMedicaValidation,
 } = require('../../validators/evolucionMedicaValidator')


// POST /api/evoluciones-medicas
router.post('/', registrarEvolucionMedicaValidation(), evolucionMedicaApiController.registrarEvolucionMedica);


module.exports = router;
