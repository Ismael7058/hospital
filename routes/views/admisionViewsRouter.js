const express = require('express');
const router = express.Router();
const admisionController = require('../../controllers/views/admisionViewsController');


router.get('/', admisionController.getAdmisiones);

module.exports = router;
