const express = require('express');
const router = express.Router();
const especialidadController = require('../../controllers/views/especialidadViewsController');

router.get('/', especialidadController.getListar);


module.exports = router;
