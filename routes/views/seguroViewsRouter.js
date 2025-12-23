const express = require('express');
const router = express.Router();
const seguroController = require('../../controllers/views/seguroViewsController');

router.get('/', seguroController.getListar);


module.exports = router;
