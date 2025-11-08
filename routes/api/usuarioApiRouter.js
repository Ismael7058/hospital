const express = require('express');
const router = express.Router();

const usuarioApiController = require('../controllers/api/usuarioApiController');
const { registerUsuarioValidation, editPerfilValidation } = require('../../validators/usuarioValidators');

// POST /api/usuarios/register
router.post('/register', registerUsuarioValidation(), usuarioApiController.registerUsario);

// POST /api/usuarios/editPerfil
router.post('/editPerfil', editPerfilValidation(), usuarioApiController.editPerfil);

module.exports = router;
