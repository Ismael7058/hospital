const express = require('express');
const router = express.Router();
const matriculaController = require('../../controllers/views/matriculaViewsController');


router.get('/', matriculaController.getListar);

router.get('/Registrar', matriculaController.getRegistrar);

router.get('/:id', matriculaController.getMatricula)

module.exports = router;
