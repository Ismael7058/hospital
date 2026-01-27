const express = require('express');
const router = express.Router();
const admisionController = require('../../controllers/views/admisionViewsController');


router.get('/', admisionController.getAdmisiones);

router.get('/registrar', admisionController.getRegistrar)

module.exports = router;
