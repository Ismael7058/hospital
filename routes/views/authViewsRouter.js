const express = require('express');
const router = express.Router();
const mainController = require('../../controllers/views/authViewsController');


router.get('/', mainController.getHome);

module.exports = router;
