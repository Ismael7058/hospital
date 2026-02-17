const express = require('express');
const router = express.Router();

const estudioSolicitadoApiController = require('../../controllers/api/estudioSolicitadoApiController.js');
const {
  registrarEstudioSolicitadoValidation,
  setActivoValidation,
 } = require('../../validators/estudioSolicitadoValidator.js')


// POST /api/estudios-solicitados
router.post('/', registrarEstudioSolicitadoValidation(), estudioSolicitadoApiController.registrarEstudioSolicitado);

// PATCH /api/estudios-solicitados/:id/activo
router.patch('/:id/activo', setActivoValidation(), estudioSolicitadoApiController.setActivo);


module.exports = router;
