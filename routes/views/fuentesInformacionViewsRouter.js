const express = require('express');
const router = express.Router();
const fuenteInformacionController = require('../../controllers/views/fuentesInformacionViewsController');

router.get('/', fuenteInformacionController.getListar);


module.exports = router;
