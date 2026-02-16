const express = require('express');
const router = express.Router();

const estudioSolicitadoApiController = require('../../controllers/api/estudioSolicitadoApiController.js');
const {
  registrarEstudioSolicitadoValidation,
 } = require('../../validators/estudioSolicitadoValidator.js')


// POST /api/estudios-solicitados
router.post('/', registrarEstudioSolicitadoValidation(), estudioSolicitadoApiController.registrarEstudioSolicitado);


module.exports = router;
