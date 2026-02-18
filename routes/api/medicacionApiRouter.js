const express = require('express');
const router = express.Router();

const medicacionApiController = require('../../controllers/api/medicacionApiController.js');
const {
  registrarMedicacionValidation,
 } = require('../../validators/medicacionValidator');

// POST /api/medicaciones
router.post('/', registrarMedicacionValidation(), medicacionApiController.registrarMedicacion);


module.exports = router;
