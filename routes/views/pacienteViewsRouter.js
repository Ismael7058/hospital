const express = require('express');
const router = express.Router();
const infraestructuraController = require('../../controllers/views/pacienteViewsController');

router.get('/', infraestructuraController.getListaPaciente);

router.get('/registrar', infraestructuraController.getRegistrar);

module.exports = router;
