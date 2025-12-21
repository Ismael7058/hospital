const express = require('express');
const router = express.Router();
const infraestructuraController = require('../../controllers/views/pacienteViewsController');

router.get('/', infraestructuraController.getListaPaciente);

router.get('/registrar', infraestructuraController.getRegistrar);

router.get('/:id', infraestructuraController.getPaciente);

module.exports = router;
