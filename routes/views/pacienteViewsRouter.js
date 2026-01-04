const express = require('express');
const router = express.Router();
const pacienteController = require('../../controllers/views/pacienteViewsController');

router.get('/', pacienteController.getListaPaciente);

router.get('/registrar', pacienteController.getRegistrar);

router.get('/:id/seguros', pacienteController.getSeguros);

router.get('/:id/antecedentes', pacienteController.getAntecedentes);

router.get('/:id', pacienteController.getPaciente);

module.exports = router;
