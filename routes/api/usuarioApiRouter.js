const express = require('express');
const router = express.Router();

const usuarioApiController = require('../controllers/api/usuarioApiController');
const { registerUsuarioValidation } = require('../../validators/usuarioValidators');

// POST /api/usuarios/register
router.post('/register', registerUsuarioValidation(), usuarioApiController.registerUsario);

module.exports = router;
