const express = require('express');
const router = express.Router();

const usuarioApiController = require('../../controllers/api/usuarioApiController');
const { 
    registerUsuarioValidation, 
    editPerfilValidation, 
    editPasswordAdminValidation, 
    modifyUsuarioValidation, 
    editInfoPersonalValidation,
    editCuentaValidation
} = require('../../validators/usuarioValidators');

// POST /api/usuarios/register
router.post('/register', registerUsuarioValidation(), usuarioApiController.registerUsuario);

// PATCH /api/usuarios/infoPersonal/:idUsuario
router.patch('/infoPersonal/:idUsuario', editInfoPersonalValidation(), usuarioApiController.infoPersonal);

// PATCH /api/usuarios/editCuenta/:idUsuario
router.patch('/editCuenta/:idUsuario', editCuentaValidation(), usuarioApiController.editCuenta);

// PATCH /api/usuarios/editPassword/:idUsuario
router.patch('/editPassword/:idUsuario', editPasswordAdminValidation(), usuarioApiController.editPasswordAdmin);

// PATCH /api/usuarios/estado/:idUsuario
router.patch('/estado/:idUsuario', usuarioApiController.setEstado);

// PUT /api/usuarios/editPerfil
router.put('/editPerfil',  usuarioApiController.editPerfil);

// PUT /api/usuarios/editPassword
router.put('/editPassword', usuarioApiController.editPassword);

// PUT /api/usuarios/modify
router.put('/modify', usuarioApiController.modifyUsuario);

module.exports = router;
