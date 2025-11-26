const express = require('express');
const router = express.Router();
const matriculaController = require('../../controllers/views/matriculaViewsController');

router.get('/Registrar', matriculaController.getRegistrar);

router.get('/Listar', matriculaController.getListar);

router.get('/:id', matriculaController.getMatricula)

module.exports = router;
