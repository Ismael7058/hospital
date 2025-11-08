const express = require('express');
const router = express.Router();

const usuarioApiController = require('../controllers/api/usuarioApiController');
const { registerUsuarioValidation, editPerfilValidation, editPasswordValidation, modifyUsuarioValidation } = require('../../validators/usuarioValidators');

// POST /api/usuarios/register
router.post('/register', registerUsuarioValidation(), usuarioApiController.registerUsario);

// PUT /api/usuarios/editPerfil
router.put('/editPerfil', editPerfilValidation(), usuarioApiController.editPerfil);

// PUT /api/usuarios/editPassword
router.put('/editPassword', editPasswordValidation(), usuarioApiController.editPassword);

// PUT /api/usuarios/modify
router.put('/modify', modifyUsuarioValidation(), usuarioApiController.modifyUsuario);

// POST /api/usuarios/altaLogica
router.post('/altaLogica', usuarioApiController.altaLogica);

// POST /api/usuarios/bajaLogica
router.post('/bajaLogica', usuarioApiController.bajaLogica);


module.exports = router;
