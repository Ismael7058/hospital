const express = require('express');
const router = express.Router();

const cuidadoApiController = require('../../controllers/api/cuidadoApiController.js');
const {
  registrarCuidadoValidation,
 } = require('../../validators/cuidadoValidator.js')


// POST /api/cuidados-preeliminares
router.post('/', registrarCuidadoValidation(), cuidadoApiController.registrarCuidado);


module.exports = router;
