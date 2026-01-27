const express = require('express');
const router = express.Router();

const admisionController = require('../../controllers/api/admisionApiController');
const { registrarAdmisionValidation } = require('../../validators/admisionValidator')

// POST /api/admisiones/registrar
router.post('/registrar', registrarAdmisionValidation(), admisionController.registrarAdmision);


module.exports = router;
