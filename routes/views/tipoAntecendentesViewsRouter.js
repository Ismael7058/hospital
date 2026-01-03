const express = require('express');
const router = express.Router();
const tipoAntecedenteController = require('../../controllers/views/tipoAntecedentesViewsController');

router.get('/', tipoAntecedenteController.getListar);


module.exports = router;
